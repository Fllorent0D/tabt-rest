import { NestFactory } from '@nestjs/core';
import { DataAfttImporterModule } from './data-aftt-importer.module';

async function bootstrap() {
  const app = await NestFactory.create(DataAfttImporterModule);
  await app.listen(3000);
}
bootstrap();
