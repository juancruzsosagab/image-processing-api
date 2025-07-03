import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTaskUseCase } from '../../application/use-cases/create-task.usecase';
import { GetTaskUseCase } from '../../application/use-cases/get-task.usecase';
import { TaskProps } from '../../domain/models/task.props';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getTaskUseCase: GetTaskUseCase,
  ) {}

  /**
   * POST /tasks
   * Creates a new task.
   */
  @Post()
  async create(@Body() body: Partial<TaskProps>): Promise<TaskProps> {
    return this.createTaskUseCase.execute(body);
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
