import { Module } from '@nestjs/common';

import { ApplicationModule } from '../application/application.module';
import { TaskController } from './controllers/task.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [TaskController],
})
export class PresentationModule {}
