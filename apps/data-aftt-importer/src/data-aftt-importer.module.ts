import { Module } from '@nestjs/common';
import { DataAfttImporterController } from './data-aftt-importer.controller';
import { DataAfttImporterService } from './data-aftt-importer.service';

@Module({
  imports: [],
  controllers: [DataAfttImporterController],
  providers: [DataAfttImporterService],
})
export class DataAfttImporterModule {}
