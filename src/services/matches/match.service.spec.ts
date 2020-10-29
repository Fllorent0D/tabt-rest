import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';

describe('MatchService', () => {
  let service: MatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: TabtClientService,
          useValue: {
            GetSeasonsAsync: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<MatchService>(MatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
