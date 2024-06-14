import { Injectable } from '@nestjs/common';
import { SeasonEntry } from '../../entity/tabt-soap/TabTAPI_Port';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';
import { ContextService } from '../../common/context/context.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeasonService {
  constructor(
    private tabtClient: TabtClientService,
    private readonly context: ContextService,
    private readonly configService: ConfigService,
  ) {}

  async getSeasons(): Promise<SeasonEntry[]> {
    const result = await this.tabtClient.GetSeasonsAsync({});
    return result.SeasonEntries;
  }

  async getCurrentSeason(): Promise<SeasonEntry> {
    const season = await this.getSeasons();
    return season.find(
      (season) =>
        season.Season === Number(this.configService.get('CURRENT_SEASON')),
    );
  }

  async getSeasonById(id: number): Promise<SeasonEntry> {
    const season = await this.getSeasons();
    return season.find((season) => season.Season === id);
  }
}
