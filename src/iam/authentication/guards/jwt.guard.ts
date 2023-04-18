import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError } from 'jsonwebtoken';
import { AuthService } from '../auth.service';
import { ACTIVE_USER_KEY } from 'src/iam/iam.constants';

const NO_TOKEN_FOUND_ERR_MSG = 'Missing authorization header';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request?.headers?.authorization?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException(NO_TOKEN_FOUND_ERR_MSG);
      }
      const payload = await this.authService.validateAndDecodeToken(token);

      request[ACTIVE_USER_KEY] = { id: payload.sub, email: payload.email };
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
