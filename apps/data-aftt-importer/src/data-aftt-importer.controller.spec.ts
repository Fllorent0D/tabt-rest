import { Test, TestingModule } from '@nestjs/testing';
import { DataAfttImporterController } from './data-aftt-importer.controller';
import { DataAfttImporterService } from './data-aftt-importer.service';

describe('DataAfttImporterController', () => {
  let dataAfttImporterController: DataAfttImporterController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DataAfttImporterController],
      providers: [DataAfttImporterService],
    }).compile();

    dataAfttImporterController = app.get<DataAfttImporterController>(DataAfttImporterController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(dataAfttImporterController.getHello()).toBe('Hello World!');
    });
  });
});
