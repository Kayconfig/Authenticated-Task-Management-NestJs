import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError } from 'jsonwebtoken';
import { AuthService } from '../auth.service';

import { ConfigType } from '@nestjs/config';
import { iamConfig } from 'src/iam/config/iam.config';

const NO_TOKEN_FOUND_ERR_MSG = 'Missing authorization header';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    @Inject(iamConfig.KEY)
    private readonly config: ConfigType<typeof iamConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request?.headers?.authorization?.split(' ')[1];
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
      console.error(error);
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException();
      }
      throw error;
    }
  }
}
