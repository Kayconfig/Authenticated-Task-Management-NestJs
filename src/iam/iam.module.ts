import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UserModule } from 'src/user/user.module';
import { HashingService } from './auth/hashing/hashing.service';
import { BcryptService } from './auth/hashing/bcrypt.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtGuard } from './auth/guards/jwt.guard';
import { ConfigModule } from '@nestjs/config';
import { authConfig } from './auth/config/jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';

@Module({
  imports: [UserModule, ConfigModule.forFeature(authConfig), JwtModule],
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
  ],
  controllers: [AuthController],
})
export class IamModule {}
