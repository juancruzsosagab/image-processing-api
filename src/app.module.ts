import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { ApplicationModule } from './application/application.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { DatabaseModule } from './config/database.module';
import { PresentationModule } from './presentation/presentation.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    ApplicationModule,
    InfrastructureModule,
    PresentationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
