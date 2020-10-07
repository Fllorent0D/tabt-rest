import { CACHE_MANAGER, CacheStore, Inject, Injectable, Logger } from '@nestjs/common';
import { ClubEntry, DivisionEntry, GetClubsInput, TabTAPISoap } from '../../entity/tabt/TabTAPI_Port';
import { CacheService } from '../../providers/cache/cache.service';

const CACHE_KEY = 'CLUBS-';

@Injectable()
export class ClubService {
  private readonly logger = new Logger('ClubService', true);

  constructor(
    @Inject('TABT_CLIENT') private tabtClient: TabTAPISoap,
    private cacheService: CacheService,
  ) {
  }

  async getClubs(input: GetClubsInput): Promise<ClubEntry[]> {
    const getter = async () => {
      const [result] = await this.tabtClient.GetClubsAsync(input);
      this.logger.debug('Fetched clubs from TabT');
      return result.ClubEntries;
    };
    return this.cacheService.getAndSetInCache(CACHE_KEY, input, getter, 3600);
  }

  async getClubsById(input: GetClubsInput, uniqueIndex: string): Promise<ClubEntry> {
    const clubs = await this.getClubs(input);
    return clubs.find((club) => club.UniqueIndex === uniqueIndex)
  }


}
