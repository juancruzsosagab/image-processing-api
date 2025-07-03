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

  async execute(input: Partial<TaskProps>): Promise<TaskProps> {
    if (!input.status) {
      throw new Error('Status is required');
    }
    if (input.price == null) {
      throw new Error('Price is required');
    }

    return this.taskRepository.create({
      status: input.status,
      price: input.price,
      originalPath: input.originalPath,
      images: input.images ?? [],
    });
  }
}
