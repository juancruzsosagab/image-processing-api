import { Module } from '@nestjs/common';
import { TaskController } from './task/task.controller';
import { ImageProcessorService } from './services/image.processor/image.processor.service';

import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './persistence/mongoose/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  controllers: [TaskController],
  providers: [ImageProcessorService],
})
export class InfrastructureModule {}
