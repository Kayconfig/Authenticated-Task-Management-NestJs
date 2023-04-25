import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import {
  AllTasksResponseDto,
  CreateTaskResponseDto,
} from './dto/responses.dto';
import { createInstance } from './createInstance';
import { TODO_NOT_FOUND_ERR_MSG } from './task.constants';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}
  async create(
    createTodoDto: CreateTaskDto,
    ownerId: string,
  ): Promise<CreateTaskResponseDto> {
    try {
      const task = await this.taskRepo.create({ ...createTodoDto, ownerId });
      return createInstance(
        CreateTaskResponseDto,
        await this.taskRepo.save(task),
      );
    } catch (error) {
      throw error;
    }
  }

  async findAll(ownerId: string) {
    try {
      return createInstance(
        AllTasksResponseDto,
        await this.taskRepo.find({ where: { ownerId } }),
      );
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string, ownerId: string) {
    try {
      const task = await this.taskRepo.findOne({ where: { id, ownerId } });
      if (!task) {
        throw new NotFoundException(TODO_NOT_FOUND_ERR_MSG);
      }
      return createInstance(CreateTaskResponseDto, task);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, ownerId: string) {
    try {
      const result = await this.taskRepo.update(
        { id, ownerId },
        { ...updateTaskDto },
      );
      if (!result.affected) {
        throw new NotFoundException(TODO_NOT_FOUND_ERR_MSG);
      }
      return this.findOne(id, ownerId);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string, ownerId: string) {
    try {
      await this.taskRepo.delete({ id, ownerId });
    } catch (error) {
      throw error;
    }
  }
}
