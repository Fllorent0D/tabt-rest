import { Test, TestingModule } from '@nestjs/testing';
import { SeasonService } from './season.service';

describe('SeasonService', () => {
  let provider: SeasonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeasonService],
    }).compile();

    provider = module.get<SeasonService>(SeasonService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
