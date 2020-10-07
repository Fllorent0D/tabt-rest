import { CACHE_MANAGER, CacheStore, Inject, Injectable, Logger } from '@nestjs/common';
import {
  GetMembersInput,
  GetClubTeamsInput,
  MemberEntry,
  TabTAPISoap,
  TeamEntry,
} from '../../entity/tabt/TabTAPI_Port';
import { CacheService } from '../../providers/cache/cache.service';

const CACHE_KEY = 'TEAMS-';

@Injectable()
export class ClubTeamService {
  private readonly logger = new Logger('ClubTeamService', true);

  constructor(
    @Inject('TABT_CLIENT') private tabtClient: TabTAPISoap,
    private cacheService: CacheService,
  ) {
  }

  async getClubsTeams(input: GetClubTeamsInput): Promise<TeamEntry[]> {
    const getter = async () => {
      const [result] = await this.tabtClient.GetClubTeamsAsync(input);
      this.logger.debug('Fetched club teams from TabT');
      return result.TeamEntries;
    };
    return this.cacheService.getAndSetInCache(CACHE_KEY, input, getter, 3600);
  }
}
