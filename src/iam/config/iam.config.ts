import { registerAs } from '@nestjs/config';
const IAM_CONFIG_TOKEN = 'IAM';
export const iamConfig = registerAs(IAM_CONFIG_TOKEN, () => ({
  issuer: process.env.ISSUER,
  secret: process.env.JWT_SECRET,
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL,
  refreshTokenTtl: process.env.REFRESH_ACCESS_TOKEN_TTL,
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: +process.env.REDIS_PORT || 6379,
}));
