import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ErrorsFilterModule } from '@app/errors-filter/errors-filter.module';
import { ErrorsFilter } from '@app/errors-filter/errors.filter';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const errorsFilter = app
    .select<ErrorsFilterModule>(ErrorsFilterModule)
    .get(ErrorsFilter);

  app.useGlobalFilters(errorsFilter);

  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.enableCors({
    // origin: [process.env.FRONTEND_URL],
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT);
}

bootstrap();
