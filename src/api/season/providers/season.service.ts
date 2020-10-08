import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  GetClubTeamsInput,
  GetSeasonsInput,
  SeasonEntry,
  TabTAPISoap,
  TeamEntry,
} from '../../../entity/tabt/TabTAPI_Port';
import { CacheService } from '../../../providers/cache/cache.service';
const CACHE_KEY = 'SEASON-';

@Injectable()
export class SeasonService {
  private readonly logger = new Logger('ClubTeamService', true);

  constructor(
    @Inject('TABT_CLIENT') private tabtClient: TabTAPISoap,
    private cacheService: CacheService,
  ) {
  }

  async getSeasons(input: GetSeasonsInput): Promise<SeasonEntry[]> {
    const getter = async () => {
      const [result] = await this.tabtClient.GetSeasonsAsync(input);
      this.logger.debug('Fetched seasons from TabT');
      return result.SeasonEntries;
    };
    return this.cacheService.getAndSetInCache(CACHE_KEY, input, getter, 3600);
  }

  async getCurrentSeason(input: GetSeasonsInput): Promise<SeasonEntry> {
    const season = await this.getSeasons(input);
    return season.find(season => season.IsCurrent);
  }
}
