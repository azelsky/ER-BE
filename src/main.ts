import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: 'http://localhost:5000'
  });

  await app.listen(port, () => {
    console.log(`Server started on ${port}`);
  });
}

bootstrap();
