import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from './config.module';
import { Logger } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('mongodbUri');
        if (!uri) {
          throw new Error('MONGO_URI is missing in configuration!');
        }

        return {
          uri,
          onConnectionCreate: (connection) => {
            connection.on('connected', () =>
              Logger.log('✅ MongoDB connected', 'Mongoose'),
            );
            connection.on('open', () =>
              Logger.log('✅ MongoDB connection open', 'Mongoose'),
            );
            connection.on('disconnected', () =>
              Logger.warn('⚠️ MongoDB disconnected', 'Mongoose'),
            );
            connection.on('error', (err) =>
              Logger.error('❌ MongoDB error', err, 'Mongoose'),
            );
            return connection;
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
