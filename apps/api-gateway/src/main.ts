import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix('api');

  const port = parseInt(process.env.PORT || '3000', 10);
  const host = process.env.API_HOST || '0.0.0.0';

  await app.listen(port, host, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║  The Infinite Closet - API Gateway (NestJS)              ║
║  Server running on ${host}:${port}                        ║
╚═══════════════════════════════════════════════════════════╝
    `);
  });
}
bootstrap();
