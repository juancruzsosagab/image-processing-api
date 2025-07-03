import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './persistence/mongoose/task.schema';
import { ImageProcessorService } from './services/image.processor/image.processor.service';
import { TASK_REPOSITORY } from '../domain/ports/task-repository.port';
import { TaskRepository } from './persistence/mongoose/task.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  providers: [
    ImageProcessorService,
    {
      provide: TASK_REPOSITORY,
      useClass: TaskRepository,
    },
  ],
  exports: [TASK_REPOSITORY, ImageProcessorService],
})
export class InfrastructureModule {}
