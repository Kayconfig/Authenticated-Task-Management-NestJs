import { Module } from '@nestjs/common';
import { AuthService } from './authentication/auth.service';
import { AuthController } from './authentication/auth.controller';
import { UserModule } from 'src/user/user.module';
import { HashingService } from './authentication/hashing/hashing.service';
import { BcryptService } from './authentication/hashing/bcrypt.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtGuard } from './authentication/guards/jwt.guard';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './authentication/guards/auth.guard';
import { RedisService } from './authentication/redis/redis.service';
import { iamConfig } from './config/iam.config';

@Module({
  imports: [UserModule, ConfigModule.forFeature(iamConfig), JwtModule],
  providers: [
    AuthService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    BcryptService,
    JwtService,
    JwtGuard,
    RedisService,
  ],
  controllers: [AuthController],
})
export class IamModule {}
