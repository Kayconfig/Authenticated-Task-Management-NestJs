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
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { HashingService } from './hashing/hashing.service';
import { JsonWebTokenError } from 'jsonwebtoken';
import { INTERNAL_SERVER_ERR_MSG } from 'src/app.constants';
import { ConfigType } from '@nestjs/config';
import { authConfig } from './config/jwt.config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
    private readonly userService: UserService,
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
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
      return new SignUpResponseDto('registration successful');
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
      const payload = { sub: user.id, email: user.email };
      const [accessToken, refreshAccessToken] = await Promise.all([
        this.generateToken(payload, this.config.accessTokenTtl),
        this.generateToken(payload, this.config.refreshTokenTtl),
      ]);
      const response = new SignInResponseDto();
      response.accessToken = accessToken;
      response.refreshAccessToken = refreshAccessToken;
      return response;
    } catch (err) {
      throw err;
    }
  }
  async generateToken(payload: Record<string, any>, tokenTtl: string) {
    return this.jwtService.sign(payload, {
      issuer: this.config.issuer,
      secret: this.config.secret,
      expiresIn: tokenTtl,
    });
  }
  async decodeToken(token: string, tokenTtl: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        issuer: this.config.issuer,
        secret: this.config.secret,
        maxAge: tokenTtl,
      });
      return payload;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException();
      }
      throw new InternalServerErrorException(INTERNAL_SERVER_ERR_MSG);
    }
  }
}
