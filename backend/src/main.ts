import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseTimeInterceptor } from './common/interceptors/response-time.interceptor';
import { envConfig } from './config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const origins = envConfig.webOrigin.split(',').map((o) => o.trim());
  app.enableCors({
    origin: origins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseTimeInterceptor());

  await app.listen(envConfig.port, '0.0.0.0');
  console.log(`BrewLite Backend API listening on http://localhost:${envConfig.port}`);
}

bootstrap();
