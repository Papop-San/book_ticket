import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigin = process.env.CORS_ORIGIN?.split(',');
  app.enableCors({ origin: corsOrigin });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('InfraPluss Booking API')
    .setDescription('API documentation for ticket booking system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);
  console.log(`🚀 Backend running on port ${port}`);
  console.log(`📖 Swagger docs: http://localhost:${port}/api-docs`);
}
bootstrap();
