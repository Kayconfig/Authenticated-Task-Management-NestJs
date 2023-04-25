import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TODO_NOT_FOUND_ERR_MSG } from './task.constants';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
});

describe('TaskService', () => {
  let service: TaskService;
  let module: TestingModule;
  let taskRepository: MockRepository;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: createMockRepository<Task>(),
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get<MockRepository>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    const testTask = {
      id: randomUUID(),
      title: 'Title',
      ownerId: randomUUID(),
      createdAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
    };
    describe('when task with id exist for a user', () => {
      it('should return coffee object', async () => {
        taskRepository.findOne.mockResolvedValue(testTask);

        const result = await service.findOne(testTask.id, testTask.ownerId);
        expect(result.data).toBe(testTask);
      });
    });

    describe('otherwise', () => {
      it('should throw NotFoundException', async () => {
        try {
          await service.findOne(testTask.id, testTask.ownerId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toBe(TODO_NOT_FOUND_ERR_MSG);
        }
      });
    });
  });

  describe('create', () => {
    describe('when provided with new task data', () => {
      it('should create and return new task object', async () => {
        const newTask: CreateTaskDto = {
          title: 'task title',
          isCompleted: false,
        };
        const ownerId = 'ownerId';

        // initially empty
        const expectedTask = {};

        taskRepository.create.mockImplementation((obj) => ({
          ...obj,
          createdAt: new Date().toISOString(),
          updateAt: new Date().toISOString(),
        }));

        taskRepository.save.mockImplementation((task) => {
          //update expected Task
          Object.assign(expectedTask, task);
          return task;
        });

        const { data: createdTask } = await service.create(newTask, ownerId);
        expect(createdTask).toStrictEqual(expectedTask);
      });
    });
  });

  describe('update', () => {
    describe('when provided with updates for a task fields such title or isComplete', () => {
      it('should update task provided that task exists in db', async () => {
        const taskToUpdate = {
          id: randomUUID(),
          ownerId: 'taskOwner',
          title: 'Original Title',
        };
        const updatedTitle = 'Updated Title';
        taskRepository.update.mockImplementation(({ id, ownerId }, updates) => {
          expect(id).toBe(taskToUpdate.id);
          expect(ownerId).toBe(taskToUpdate.ownerId);
          Object.assign(taskToUpdate, updates);
          return { affected: 1 };
        });
        taskRepository.findOne.mockResolvedValue(taskToUpdate);
        const {
          data: { id, ownerId, title },
        } = await service.update(
          taskToUpdate.id,
          { title: updatedTitle },
          taskToUpdate.ownerId,
        );
        expect({ id, ownerId, title }).toEqual({
          id,
          ownerId,
          title: updatedTitle,
        });
      });
    });

    describe('otherwise', () => {
      it('should throw not found exception if task does not exist in db', async () => {
        taskRepository.update.mockResolvedValue({ affected: 0 });
        await expect(
          service.update(
            'randomIdForTask',
            { title: 'randomTitle' },
            'ownerId',
          ),
        ).rejects.toThrowError(NotFoundException);
      });
    });
  });
});
