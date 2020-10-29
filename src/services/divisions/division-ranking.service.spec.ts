import { Test, TestingModule } from '@nestjs/testing';
import { DivisionRankingService } from './division-ranking.service';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';

describe('DivisionRankingService', () => {
  let service: DivisionRankingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DivisionRankingService,
        {
          provide: TabtClientService,
          useValue: {
            GetSeasonsAsync: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<DivisionRankingService>(DivisionRankingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
