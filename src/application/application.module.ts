import { Module } from '@nestjs/common';
import { CreateTaskUseCase } from './use-cases/create-task.usecase';
import { GetTaskUseCase } from './use-cases/get-task.usecase';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  providers: [CreateTaskUseCase, GetTaskUseCase],
  exports: [CreateTaskUseCase, GetTaskUseCase],
})
export class ApplicationModule {}
