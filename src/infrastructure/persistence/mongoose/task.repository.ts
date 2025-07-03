import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
  ) {}

  async create(task: Partial<Task>): Promise<Task> {
    const created = new this.taskModel(task);
    return created.save();
  }

  async findById(taskId: string): Promise<Task | null> {
    return this.taskModel.findById(taskId).lean();
  }

  async updateImagesAndStatus(
    taskId: string,
    images: { resolution: string; path: string }[],
    status: 'completed' | 'failed',
  ): Promise<void> {
    await this.taskModel.findByIdAndUpdate(taskId, {
      $set: { images, status },
    });
  }

  async updateStatus(taskId: string, status: string): Promise<void> {
    await this.taskModel.findByIdAndUpdate(taskId, {
      $set: { status },
    });
  }
}
