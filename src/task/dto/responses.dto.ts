import { Task } from '../entities/task.entity';

export class CreateTaskResponseDto {
  data: Task;
  constructor(data: Task) {
    this.data = data;
  }
}

export class UpdateTaskResponseDto {
  data: Task;
  constructor(data: Task) {
    this.data = data;
  }
}

export class AllTasksResponseDto {
  data: Task[];
  constructor(data: Task[]) {
    this.data = data;
  }
}
