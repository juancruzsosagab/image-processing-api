import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema';
import { Task as DomainTask } from '../../../domain/models/task.model';
import { TaskRepositoryPort } from '../../../domain/ports/task-repository.port';
import {
  TaskProps,
  TaskImage,
  TaskStatus,
} from '../../../domain/models/task.props';
import { Types } from 'mongoose';

@Injectable()
export class TaskRepository implements TaskRepositoryPort {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
  ) {}

  async create(task: Partial<TaskProps>): Promise<DomainTask> {
    const created = new this.taskModel(task);
    const saved = await created.save();
    const id = (saved._id as Types.ObjectId).toString();
    return DomainTask.create({
      id,
      status: saved.status,
      price: saved.price,
      originalPath: saved.originalPath,
      images: saved.images,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    });
  }

  async findById(taskId: string): Promise<DomainTask | null> {
    const doc = await this.taskModel.findById(taskId).lean();
    if (!doc) {
      return null;
    }
    const id = (doc._id as Types.ObjectId).toString();
    return DomainTask.create({
      id,
      status: doc.status,
      price: doc.price,
      originalPath: doc.originalPath,
      images: doc.images ?? [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async updateImagesAndStatus(
    taskId: string,
    images: TaskImage[],
    status: Exclude<TaskStatus, 'pending'>,
  ): Promise<void> {
    await this.taskModel.findByIdAndUpdate(taskId, {
      $set: { images, status },
    });
  }

  async updateStatus(taskId: string, status: TaskStatus): Promise<void> {
    await this.taskModel.findByIdAndUpdate(taskId, {
      $set: { status },
    });
  }
}
