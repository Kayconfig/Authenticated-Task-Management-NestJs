import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dtos/sign-in.dto';
import { SignInResponseDto } from './dtos/sign-in-response.dto';
import { SignUpResponseDto } from './dtos/sign-up-response.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from './hashing/hashing.service';
import { JsonWebTokenError } from 'jsonwebtoken';
import { INTERNAL_SERVER_ERR_MSG } from 'src/app.constants';
import { ConfigType } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { createInstance } from 'src/task/createInstance';
import { randomUUID } from 'crypto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { RedisService } from './redis/redis.service';
import { ActiveUserDto } from 'src/common/dtos/active-user.dto';
import { iamConfig } from '../config/iam.config';
import { omit } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
    private readonly userService: UserService,
    @Inject(iamConfig.KEY)
    private readonly config: ConfigType<typeof iamConfig>,
    private readonly redisService: RedisService,
  ) {}
  async signUp(dto: SignUpDto): Promise<SignUpResponseDto> {
    try {
      const { email } = dto;
      const userExist = await this.userService
        .findOneByEmail(email)
        .catch(() => null);
      if (userExist) {
        throw new ForbiddenException('email already exist.');
      }
      const password = await this.hashingService.hash(dto.password);
      await this.userService.create({ email, password });
      return createInstance(SignUpResponseDto, 'registration successful');
    } catch (err) {
      throw err;
    }
  }
  async signIn(dto: SignInDto): Promise<SignInResponseDto> {
    try {
      const { email, password } = dto;
      const user = await this.userService
        .findOneByEmail(email)
        .catch(() => null);
      if (!user) {
        throw new BadRequestException('Invalid email or password');
      }
      const passwordIsValid = await this.hashingService.compare(
        password,
        user.password,
      );
      if (!passwordIsValid) {
        throw new BadRequestException('Invalid email or password');
      }
      const tokenId = randomUUID();
      const payload = {
        sub: user.id,
        email: user.email,
        tokenId,
      };
      const tokens = await this.generateAccessAndRefreshToken(payload);
      await this.updateTokenId({ email: user.email, id: user.id }, tokenId);
      return createInstance(SignInResponseDto, tokens);
    } catch (err) {
      throw err;
    }
  }

  private async generateAccessAndRefreshToken(payload: Record<string, any>) {
    const [accessToken, refreshAccessToken] = await Promise.all([
      this.generateToken(payload, this.config.accessTokenTtl),
      this.generateToken(payload, this.config.refreshTokenTtl),
    ]);

    return { accessToken, refreshAccessToken };
  }

  async generateToken(payload: Record<string, any>, tokenTtl: string) {
    payload.exp = ((Date.now() / 1000) | 0) + +tokenTtl;
    payload.iss = this.config.issuer;
    return this.jwtService.sign(payload, {
      secret: this.config.secret,
    });
  }

  async validateAndDecodeToken(token: string) {
    try {
      const { email, sub, tokenId } = await this.decodeToken(token);
      const activeUser = this.createActiveUserDto(email, sub);
      await this.redisService.validateTokenId(activeUser, tokenId);
      return { email, sub, tokenId };
    } catch (error) {
      console.error('decodeToken Error::', error);
      if (
        error instanceof JsonWebTokenError ||
        error instanceof UnauthorizedException
      ) {
        throw new UnauthorizedException();
      }
      throw new InternalServerErrorException(INTERNAL_SERVER_ERR_MSG);
    }
  }
  async decodeToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        issuer: this.config.issuer,
        secret: this.config.secret,
      });
      return payload;
    } catch (error) {
      console.error('decodeToken Error::', error);
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException();
      }
      throw new InternalServerErrorException(INTERNAL_SERVER_ERR_MSG);
    }
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = await this.decodeToken(dto.refreshToken);
      const user = this.createActiveUserDto(payload.email, payload.sub);
      // validate tokenId
      await this.redisService.validateTokenId(user, payload.tokenId);
      await this.updateTokenId(user, randomUUID());

      const tokens = await this.generateAccessAndRefreshToken(payload);

      return createInstance(SignInResponseDto, tokens);
    } catch (err) {
      throw err;
    }
  }

  private async updateTokenId(user: ActiveUserDto, tokenId: string) {
    // generate tokens, and store tokenId
    await this.redisService.setTokenId(user, tokenId);
  }

  private createActiveUserDto(email: string, id: string): ActiveUserDto {
    const user = new ActiveUserDto();
    user.email = email;
    user.id = id;
    return user;
  }
}
