import { Controller, Get } from '@nestjs/common';
import { DataAfttImporterService } from './data-aftt-importer.service';

@Controller()
export class DataAfttImporterController {
  constructor(private readonly dataAfttImporterService: DataAfttImporterService) {}

  @Get()
  getHello(): string {
    return this.dataAfttImporterService.getHello();
  }
}
