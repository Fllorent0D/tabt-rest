import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  GetMatchesInput,
  TabTAPISoap,
  TeamMatchesEntry,
} from '../../entity/tabt/TabTAPI_Port';
import { CacheService } from '../../providers/cache/cache.service';

const CACHE_KEY = 'MATCH-';


@Injectable()
export class MatchService {
  private readonly logger = new Logger('ClubTeamService', true);

  constructor(
    @Inject('TABT_CLIENT') private tabtClient: TabTAPISoap,
    private cacheService: CacheService,
  ) {
  }


  async getMatches(input: GetMatchesInput): Promise<TeamMatchesEntry[]> {
    const getter = async () => {
      const [result] = await this.tabtClient.GetMatchesAsync(input);
      this.logger.debug('Fetched clubs from TabT');
      return result.TeamMatchesEntries;
    };
    return this.cacheService.getAndSetInCache(CACHE_KEY, input, getter, 3600);
  }

}
