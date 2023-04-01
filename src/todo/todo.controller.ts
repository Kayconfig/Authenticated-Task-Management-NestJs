import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { MutateTodoParamDto } from './dto/mutate-todo-param.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(
    @Body() createTodoDto: CreateTodoDto,
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
    @Param() param: MutateTodoParamDto,
    @ActiveUser('id') userId: string,
  ) {
    const todoId = param.id;
    return this.todoService.findOne(todoId, userId);
  }

  @Patch(':id')
  update(
    @Param() param: MutateTodoParamDto,
    @Body() updateTodoDto: UpdateTodoDto,
    @ActiveUser('id') userId: string,
  ) {
    const todoId = param.id;
    return this.todoService.update(todoId, updateTodoDto, userId);
  }

  @Delete(':id')
  remove(@Param() param: MutateTodoParamDto, @ActiveUser('id') userId: string) {
    const todoId = param.id;
    return this.todoService.remove(todoId, userId);
  }
}
