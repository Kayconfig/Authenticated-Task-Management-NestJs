import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPEORM_ROOT_OPTIONS } from './app.constants';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { IamModule } from './iam/iam.module';
import { TodoModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync(TYPEORM_ROOT_OPTIONS),
    UserModule,
    CommonModule,
    IamModule,
    TodoModule,
  ],
})
export class AppModule {}
