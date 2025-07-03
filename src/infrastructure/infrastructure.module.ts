import { Module } from '@nestjs/common';
import { TaskController } from './task/task.controller';
import { ImageProcessorService } from './services/image.processor/image.processor.service';

@Module({
  controllers: [TaskController],
  providers: [ImageProcessorService]
})
export class InfrastructureModule {}
