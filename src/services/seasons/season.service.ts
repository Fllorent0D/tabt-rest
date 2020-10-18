import { Injectable, Logger } from '@nestjs/common';
import { GetSeasonsInput, SeasonEntry } from '../../entity/tabt-soap/TabTAPI_Port';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';

const CACHE_KEY = 'SEASON-';

@Injectable()
export class SeasonService {
  private readonly logger = new Logger('ClubTeamService', true);

  constructor(
    private tabtClient: TabtClientService,
  ) {
  }

  async getSeasons(input: GetSeasonsInput = {}): Promise<SeasonEntry[]> {
    const [result] = await this.tabtClient.GetSeasonsAsync(input);
    return result.SeasonEntries;
  }

  async getCurrentSeason(input: GetSeasonsInput = {}): Promise<SeasonEntry> {
    const season = await this.getSeasons(input);
    return season.find(season => season.IsCurrent);
  }
}
