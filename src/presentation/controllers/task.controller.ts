import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { CreateTaskUseCase } from '../../application/use-cases/create-task.usecase';
import { GetTaskUseCase } from '../../application/use-cases/get-task.usecase';
import { TaskProps } from '../../domain/models/task.props';
import { ProcessTaskUseCase } from 'src/application/use-cases/process-task.usecase';

@Controller('tasks')
export class TaskController {
  private readonly logger = new Logger(TaskController.name);
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getTaskUseCase: GetTaskUseCase,
    private readonly processTaskUseCase: ProcessTaskUseCase,
  ) {}

  /**
   * POST /tasks
   * Creates a new task.
   */
  @Post()
  async createTask(@Body() body: Partial<TaskProps>) {
    const task = await this.createTaskUseCase.execute(body);

    if (!task.id) {
      this.logger.error('Created task is missing ID. Cannot process.');
      return task;
    }

    this.processTaskUseCase.execute(task.id).catch((error) => {
      const message =
        error instanceof Error ? error.message : JSON.stringify(error);

      this.logger.error(`Failed to process task ${task.id}: ${message}`);
    });

    return {
      taskId: task.id,
      status: task.status,
      price: task.price,
    };
  }

  /**
   * GET /tasks/:id
   * Retrieves a task by ID.
   */
  @Get(':id')
  async getById(@Param('id') id: string): Promise<TaskProps | null> {
    return this.getTaskUseCase.execute(id);
  }
}
