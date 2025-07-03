import { Inject, Injectable } from '@nestjs/common';
import { TaskProps } from '../../domain/models/task.props';
import {
  TASK_REPOSITORY,
  TaskRepositoryPort,
} from '../../domain/ports/task-repository.port';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
  ) {}

  async execute(props: Partial<TaskProps>) {
    if (!props.originalPath) {
      throw new Error('originalPath is required');
    }

    const status = 'pending';
    const price = this.calculateRandomPrice();

    const newTask = await this.taskRepository.create({
      originalPath: props.originalPath,
      status,
      price,
    });

    return newTask;
  }

  /**
   * Generates a random price between 5 and 50 (inclusive).
   */
  private calculateRandomPrice(): number {
    return Math.round((Math.random() * (50 - 5) + 5) * 100) / 100;
  }
}
