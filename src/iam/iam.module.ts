import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UserModule } from 'src/user/user.module';
import { HashingService } from './auth/hashing/hashing.service';
import { BcryptService } from './auth/hashing/bcrypt.service';

@Module({
  imports: [UserModule],
  providers: [
    AuthService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    BcryptService,
  ],
  controllers: [AuthController],
})
export class IamModule {}
