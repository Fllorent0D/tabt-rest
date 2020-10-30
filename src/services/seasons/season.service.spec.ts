import { Test, TestingModule } from '@nestjs/testing';
import { SeasonService } from './season.service';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';

describe('SeasonService', () => {
  let provider: SeasonService;
  let tabtService: TabtClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeasonService,
        {
          provide: TabtClientService,
          useValue: {
            GetSeasonsAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    provider = module.get<SeasonService>(SeasonService);
    tabtService = module.get<TabtClientService>(TabtClientService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getSeasons', () => {
    it('should call the tabt service correctly and returns the seasons entries', async () => {
      const seasons = [{ Name: '1', IsCurrent: false, Season: 18 }];
      const spyOnTabt = jest.spyOn(tabtService, 'GetSeasonsAsync').mockResolvedValue([{
        CurrentSeason: 18,
        CurrentSeasonName: '1',
        SeasonEntries: seasons,
      }, '', {}, null, null]);

      const result = await provider.getSeasons();

      expect(result).toBe(seasons);
      expect(spyOnTabt).toBeCalledTimes(1);
      expect(spyOnTabt).toBeCalledWith({  });
    });
  });

  describe('getCurrentSeason', () => {
    it('should call the tabt service correctly and returns the current seasons entries', async () => {
      const currentSeason = { Name: '2', IsCurrent: true, Season: 19 };
      const seasons = [{ Name: '1', IsCurrent: false, Season: 18 }, currentSeason];
      const spyOnTabt = jest.spyOn(tabtService, 'GetSeasonsAsync').mockResolvedValue([{
        CurrentSeason: 18,
        CurrentSeasonName: '1',
        SeasonEntries: seasons,
      }, '', {}, null, null]);

      const result = await provider.getCurrentSeason();

      expect(result).toBe(currentSeason);
      expect(spyOnTabt).toBeCalledTimes(1);
      expect(spyOnTabt).toBeCalledWith({});
    });
  });
});
