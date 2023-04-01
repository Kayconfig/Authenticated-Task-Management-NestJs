import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError } from 'jsonwebtoken';
import { AuthService } from '../auth.service';
import { authConfig } from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';

const NO_TOKEN_FOUND_ERR_MSG = 'Missing authorization header';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request?.headers?.authorization;
      if (!token) {
        throw new UnauthorizedException(NO_TOKEN_FOUND_ERR_MSG);
      }
      const payload = await this.authService.decodeToken(
        token,
        this.config.accessTokenTtl,
      );

      request.user = { id: payload.sub, email: payload.email };
      return true;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException();
      }
      throw error;
    }
  }
}
