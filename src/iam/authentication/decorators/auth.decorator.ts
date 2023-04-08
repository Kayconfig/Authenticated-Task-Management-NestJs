import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPES } from '../enum/auth.enum';
export const AUTH_TYPE_KEY = 'auth-type';
export const Auth = (...args: AUTH_TYPES[]) => SetMetadata(AUTH_TYPE_KEY, args);
