import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT);

  app.setGlobalPrefix('api');

  await app.listen(port, () => {
    console.log(`Server started on ${port}`);
  });
}

bootstrap();
