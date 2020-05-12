import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from '@app/logger/logger.middleware';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as Transport from 'winston-transport';
import { WinstonModule } from 'nest-winston';
import { AppEnvironment } from '@app/common/enum/app-environment';
import { format, transports } from 'winston';
import { Routes } from '@app/minio/minio.controller';
import { LoggerModule } from '@app/logger/logger.module';
import { PresentModule } from './present/present.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from './config/config.module';
import { ErrorsFilterModule } from './errors-filter/errors-filter.module';

const loggerTransports: Transport[] = [
  new DailyRotateFile({
    filename: 'cc-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    maxSize: '20m',
    maxFiles: '7d',
    dirname: process.env.LOGS_PATH,
  }),
];

if (process.env.NODE_ENV === AppEnvironment.DEVELOPMENT) {
  loggerTransports.push(new transports.Console());
}

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    WinstonModule.forRoot({
      format: format.printf((info) => info.message),
      transports: loggerTransports,
    }),
    LoggerModule,
    PresentModule,
    AuthModule,
    UserModule,
    ConfigModule,
    ErrorsFilterModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude(Routes.DOWNLOAD)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
