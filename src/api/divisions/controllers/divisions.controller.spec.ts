import { Test, TestingModule } from '@nestjs/testing';
import { DivisionsController } from './divisions.controller';

describe('DivisionsController', () => {
  let controller: DivisionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DivisionsController],
    }).compile();

    controller = module.get<DivisionsController>(DivisionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
