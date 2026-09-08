import 'reflect-metadata';
import { join } from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: false,
  });

  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Dev image uploads (STORAGE_DRIVER=local) are served from here.
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  const origins = (
    process.env.CORS_ORIGINS ?? 'http://localhost:3000,http://localhost:3001'
  )
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({ origin: origins, credentials: true });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Studio115 API')
    .setDescription('Public website + admin backend for Studio115')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port, '0.0.0.0');
  // eslint-disable-next-line no-console
  console.log(`Studio115 API → http://localhost:${port}/api  (docs: /api/docs)`);
}

void bootstrap();
