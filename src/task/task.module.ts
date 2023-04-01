import { Module } from '@nestjs/common';
import { TodoService } from './task.service';
import { TodoController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
