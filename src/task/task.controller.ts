import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { MutateTaskParamDto } from './dto/mutate-task-param.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('task')
@ApiTags('/task')
@ApiBearerAuth()
export class TodoController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(
    @Body() createTodoDto: CreateTaskDto,
    @ActiveUser('id') userId: string,
  ) {
    return this.taskService.create(createTodoDto, userId);
  }

  @Get()
  findAll(@ActiveUser('id') userId: string) {
    return this.taskService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param() param: MutateTaskParamDto,
    @ActiveUser('id') userId: string,
  ) {
    const todoId = param.id;
    return this.taskService.findOne(todoId, userId);
  }

  @Patch(':id')
  update(
    @Param() param: MutateTaskParamDto,
    @Body() updateTodoDto: UpdateTaskDto,
    @ActiveUser('id') userId: string,
  ) {
    const todoId = param.id;
    return this.taskService.update(todoId, updateTodoDto, userId);
  }

  @Delete(':id')
  remove(@Param() param: MutateTaskParamDto, @ActiveUser('id') userId: string) {
    const todoId = param.id;
    return this.taskService.remove(todoId, userId);
  }
}
