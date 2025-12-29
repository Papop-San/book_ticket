import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigin = process.env.CORS_ORIGIN?.split(',');

  app.enableCors({
    origin: corsOrigin,
  });

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);

  console.log(`🚀 Backend running on port ${port}`);
}
bootstrap();
