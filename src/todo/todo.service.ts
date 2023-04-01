import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';

const TODO_NOT_FOUND_ERR_MSG = 'Todo not found';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepo: Repository<Todo>,
  ) {}
  async create(createTodoDto: CreateTodoDto, ownerId: string) {
    try {
      const todo = await this.todoRepo.create({ ...createTodoDto, ownerId });
      return this.todoRepo.save(todo);
    } catch (error) {
      throw error;
    }
  }

  async findAll(ownerId: string) {
    try {
      return this.todoRepo.find({ where: { ownerId } });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string, ownerId: string) {
    try {
      const todo = await this.todoRepo.findOne({ where: { id, ownerId } });
      if (!todo) {
        throw new NotFoundException(TODO_NOT_FOUND_ERR_MSG);
      }
      return todo;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateTodoDto: UpdateTodoDto, ownerId: string) {
    try {
      const result = await this.todoRepo.update(
        { id, ownerId },
        { ...updateTodoDto },
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
      await this.todoRepo.delete({ id, ownerId });
    } catch (error) {
      throw error;
    }
  }
}
