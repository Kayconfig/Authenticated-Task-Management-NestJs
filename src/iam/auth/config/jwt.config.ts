import { registerAs } from '@nestjs/config';

export const AUTH_CONFIG_TOKEN = 'auth-config';
export const authConfig = registerAs(AUTH_CONFIG_TOKEN, () => ({
  issuer: process.env.ISSUER,
  secret: process.env.JWT_SECRET,
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL,
  refreshTokenTtl: process.env.REFRESH_ACCESS_TOKEN_TTL,
}));
