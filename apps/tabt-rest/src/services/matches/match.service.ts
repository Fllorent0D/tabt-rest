import { Injectable } from '@nestjs/common';
import {
  GetMatchesInput,
  TeamMatchesEntry,
} from '../../entity/tabt-soap/TabTAPI_Port';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';
import { PlayerCategory, Level } from '../../entity/tabt-input.interface';
import { PlayerCategoryDTO } from '../../common/dto/player-category.dto';
import { LevelDTO } from '../../common/dto/levels.dto';

@Injectable()
export class MatchService {
  constructor(private tabtClient: TabtClientService) {}

  async getMatches(input: GetMatchesInput): Promise<TeamMatchesEntry[]> {
    const result = await this.tabtClient.GetMatchesAsync(input);
    if (result.MatchCount === 0) {
      return [];
    }
    return result.TeamMatchesEntries.map((tme) => new TeamMatchesEntry(tme));
  }
}
