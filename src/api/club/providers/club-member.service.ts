import { CACHE_MANAGER, CacheStore, Inject, Injectable, Logger } from '@nestjs/common';
import {
  ClubEntry,
  GetClubsInput,
  GetMembersInput,
  MemberEntry,
  TabTAPISoap,
} from '../../../entity/tabt/TabTAPI_Port';
import { CacheService } from '../../../providers/cache/cache.service';

const CACHE_KEY = "MEMBERS";

@Injectable()
export class ClubMemberService {
  private readonly logger = new Logger('ClubMemberService', true);

  constructor(
    @Inject('TABT_CLIENT') private tabtClient: TabTAPISoap,
    private cacheService: CacheService,
  ) {
  }

  async getClubsMembers(input: GetMembersInput): Promise<MemberEntry[]> {
    const getter = async () => {
      const [result] = await this.tabtClient.GetMembersAsync(input);
      this.logger.debug('Fetched clubs from TabT');
      return result.MemberEntries;
    };
    return this.cacheService.getAndSetInCache(CACHE_KEY, input, getter, 3600);
  }
}
