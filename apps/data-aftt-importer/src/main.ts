import { NestFactory } from '@nestjs/core';
import { DataAFTTImporterModule } from './data-aftt-importer.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DataAFTTImporterModule,
    {
      logger: console,
      bufferLogs: false,
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    },
  );

  await app.listen();
}

bootstrap();
