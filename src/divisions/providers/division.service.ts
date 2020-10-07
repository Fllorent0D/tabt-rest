import { CACHE_MANAGER, CacheStore, Inject, Injectable, Logger } from '@nestjs/common';
import {
  DivisionEntry,
  GetDivisionRankingInput,
  GetDivisionsInput,
  RankingEntry,
  TabTAPISoap,
} from '../../entity/tabt/TabTAPI_Port';
import { CacheService } from '../../providers/cache/cache.service';

const CACHE_KEY = 'DIVISION-';

@Injectable()
export class DivisionService {
  private readonly logger = new Logger('DivisionsService', true);

  constructor(
    @Inject('TABT_CLIENT') private tabtClient: TabTAPISoap,
    private cacheService: CacheService,
  ) {
  }

  async getDivisionsAsync(input: GetDivisionsInput): Promise<DivisionEntry[]> {
    const getter = async () => {
      const [result] = await this.tabtClient.GetDivisionsAsync(input);
      this.logger.debug('Fetched divisions from TabT');
      return result.DivisionEntries;
    };
    return this.cacheService.getAndSetInCache<DivisionEntry[]>(CACHE_KEY, input, getter, 3600);
  }

  async getDivisionsByIdAsync(id: number, input: GetDivisionsInput = {}): Promise<DivisionEntry> {
    const divisions = await this.getDivisionsAsync(input);
    return divisions.find((division) => division.DivisionId === id);
  }
}
