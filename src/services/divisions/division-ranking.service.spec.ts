import { Test, TestingModule } from '@nestjs/testing';
import { DivisionRankingService } from './division-ranking.service';

describe('DivisionRankingService', () => {
  let service: DivisionRankingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DivisionRankingService],
    }).compile();

    service = module.get<DivisionRankingService>(DivisionRankingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
