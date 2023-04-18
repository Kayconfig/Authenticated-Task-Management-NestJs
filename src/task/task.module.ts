import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TodoController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TodoController],
  providers: [TaskService],
})
export class TodoModule {}
