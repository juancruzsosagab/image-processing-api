import { Module } from '@nestjs/common';
import { CreateTaskUseCase } from './use-cases/create-task.usecase';
import { GetTaskUseCase } from './use-cases/get-task.usecase';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { ProcessTaskUseCase } from './use-cases/process-task.usecase';

@Module({
  imports: [InfrastructureModule],
  providers: [CreateTaskUseCase, GetTaskUseCase, ProcessTaskUseCase],
  exports: [CreateTaskUseCase, GetTaskUseCase, ProcessTaskUseCase],
})
export class ApplicationModule {}
