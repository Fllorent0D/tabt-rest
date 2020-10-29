import { Test, TestingModule } from '@nestjs/testing';
import { TournamentService } from './tournament.service';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';

describe('TournamentService', () => {
  let service: TournamentService;
  let tabtService: TabtClientService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournamentService,
        {
          provide: TabtClientService,
          useValue: {
            GetSeasonsAsync: jest.fn(),
          },
        },
      ],
    }).compile();
    tabtService = module.get<TabtClientService>(TabtClientService);
    service = module.get<TournamentService>(TournamentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
