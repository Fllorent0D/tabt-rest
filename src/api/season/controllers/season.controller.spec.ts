import { Test, TestingModule } from '@nestjs/testing';
import { SeasonController } from './season.controller';

describe('SeasonController', () => {
  let controller: SeasonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeasonController],
    }).compile();

    controller = module.get<SeasonController>(SeasonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
