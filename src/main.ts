import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { AuthGuard } from '@core/auth/guards';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT);
  const hostname = process.env.HOSTNAME || 'localhost';

  app.useGlobalGuards(new AuthGuard(new Reflector()));
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: '*'
  });

  await app.listen(port, hostname, () => {
    console.log(`Server started on ${hostname}:${port}`);
  });
}

bootstrap();
