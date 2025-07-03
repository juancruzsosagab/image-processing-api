import { TaskProps, TaskImage, TaskStatus } from '../models/task.props';

export interface TaskRepositoryPort {
  create(task: Partial<TaskProps>): Promise<TaskProps>;

  findById(taskId: string): Promise<TaskProps | null>;

  updateImagesAndStatus(
    taskId: string,
    images: TaskImage[],
    status: Exclude<TaskStatus, 'pending'>,
  ): Promise<void>;

  updateStatus(taskId: string, status: TaskStatus): Promise<void>;
}

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');
