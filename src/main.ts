import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { AuthGuard } from '@core/auth/guards';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT);

  app.setGlobalPrefix('api');
  app.useGlobalGuards(new AuthGuard(new Reflector()));
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: 'http://localhost:5000'
  });

  await app.listen(port, () => {
    console.log(`Server started on ${port}`);
  });
}

bootstrap();
