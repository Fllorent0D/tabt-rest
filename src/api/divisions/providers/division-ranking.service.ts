import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetDivisionRankingInput, RankingEntry, TabTAPISoap } from '../../../entity/tabt/TabTAPI_Port';
import { CacheService } from '../../../providers/cache/cache.service';

const CACHE_KEY = 'DIVISION-RANKING-';


@Injectable()
export class DivisionRankingService {
  private readonly logger = new Logger('DivisionRankingService', true);

  constructor(
    @Inject('TABT_CLIENT') private tabtClient: TabTAPISoap,
    private cacheService: CacheService,
  ) {
  }

  async getDivisionRanking(id: number, input: GetDivisionRankingInput): Promise<RankingEntry[]> {
    const getter = async () => {
      const [result] = await this.tabtClient.GetDivisionRankingAsync({ DivisionId: id, ...input });
      this.logger.debug('Fetched division ranking from TabT');
      return result.RankingEntries;
    };
    return this.cacheService.getAndSetInCache<RankingEntry[]>(CACHE_KEY, input, getter, 3600);
  }
}
