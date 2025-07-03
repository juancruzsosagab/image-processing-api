import { Inject, Injectable } from '@nestjs/common';
import {
  TASK_REPOSITORY,
  TaskRepositoryPort,
} from '../../domain/ports/task-repository.port';
import { TaskProps } from '../../domain/models/task.props';

@Injectable()
export class GetTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
  ) {}

  async execute(taskId: string): Promise<TaskProps | null> {
    return this.taskRepository.findById(taskId);
  }
}
