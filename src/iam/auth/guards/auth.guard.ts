import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AUTH_TYPES } from '../enum/auth.enum';
import { JwtGuard } from './jwt.guard';
import { AUTH_TYPE_KEY } from '../decorators/auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly defaultAuthType = AUTH_TYPES.Bearer;
  private readonly authTypeMapping: Record<
    AUTH_TYPES,
    CanActivate | CanActivate[]
  > = {
    [AUTH_TYPES.Bearer]: this.jwtGuard,
    [AUTH_TYPES.None]: { canActivate: () => true },
  };
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtGuard: JwtGuard,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AUTH_TYPES[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [this.defaultAuthType];
    const guards = authTypes
      .map((authType) => this.authTypeMapping[authType])
      .flat();
    let error = new UnauthorizedException();
    for (const guard of guards) {
      const canActivate = await Promise.resolve(
        guard.canActivate(context),
      ).catch((err) => {
        error = err;
      });
      if (canActivate) {
        return true;
      }
    }

    throw error;
  }
}
