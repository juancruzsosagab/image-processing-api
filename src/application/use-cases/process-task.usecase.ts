import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TaskRepositoryPort } from '../../domain/ports/task-repository.port';
import { ImageProcessorService } from '../../infrastructure/services/image.processor/image.processor.service';
import { TASK_REPOSITORY } from '../../domain/ports/task-repository.port';
import { Inject } from '@nestjs/common';

@Injectable()
export class ProcessTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    private readonly imageProcessorService: ImageProcessorService,
  ) {}

  /**
   * Executes the processing of an image task.
   * - Checks if the task exists.
   * - Validates if it is in "pending" state.
   * - Triggers the ImageProcessorService to process it.
   */
  async execute(taskId: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    if (task.status !== 'pending') {
      throw new BadRequestException(
        `Task ${taskId} is not pending. Current status: ${task.status}`,
      );
    }

    // Call the image processor to handle the task
    await this.imageProcessorService.processTask(task);
  }
}
