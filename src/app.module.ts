import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DomainModule } from './domain/domain.module';
import { ApplicationModule } from './application/application.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { DatabaseModule } from './config/database.module';

@Module({
  imports: [
    ConfigModule,
    DomainModule,
    DatabaseModule,
    ApplicationModule,
    InfrastructureModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
