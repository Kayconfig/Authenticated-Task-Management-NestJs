import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPEORM_ROOT_OPTIONS } from './app.constants';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync(TYPEORM_ROOT_OPTIONS),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
