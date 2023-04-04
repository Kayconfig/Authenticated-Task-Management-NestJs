import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TodoService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { MutateTaskParamDto } from './dto/mutate-task-param.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('task')
@ApiTags('/task')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(
    @Body() createTodoDto: CreateTaskDto,
    @ActiveUser('id') userId: string,
  ) {
    return this.todoService.create(createTodoDto, userId);
  }

  @Get()
  findAll(@ActiveUser('id') userId: string) {
    return this.todoService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param() param: MutateTaskParamDto,
    @ActiveUser('id') userId: string,
  ) {
    const todoId = param.id;
    return this.todoService.findOne(todoId, userId);
  }

  @Patch(':id')
  update(
    @Param() param: MutateTaskParamDto,
    @Body() updateTodoDto: UpdateTaskDto,
    @ActiveUser('id') userId: string,
  ) {
    const todoId = param.id;
    return this.todoService.update(todoId, updateTodoDto, userId);
  }

  @Delete(':id')
  remove(@Param() param: MutateTaskParamDto, @ActiveUser('id') userId: string) {
    const todoId = param.id;
    return this.todoService.remove(todoId, userId);
  }
}
