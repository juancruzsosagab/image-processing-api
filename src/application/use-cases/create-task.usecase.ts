import { Injectable } from '@nestjs/common';
import { TaskRepositoryPort } from '../../domain/ports/task-repository.port';
import { TaskProps } from '../../domain/models/task.props';

@Injectable()
export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepositoryPort) {}

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
