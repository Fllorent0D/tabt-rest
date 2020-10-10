import { Injectable, Logger } from '@nestjs/common';
import { GetMatchesInput, TeamMatchesEntry } from '../../../entity/tabt/TabTAPI_Port';
import { TabtClientService } from '../../../common/tabt-client/tabt-client.service';


@Injectable()
export class MatchService {
  private readonly logger = new Logger('ClubTeamService', true);

  constructor(
    private tabtClient: TabtClientService,
  ) {
  }


  async getMatches(input: GetMatchesInput): Promise<TeamMatchesEntry[]> {
    const [result] = await this.tabtClient.GetMatchesAsync(input);
    return result.TeamMatchesEntries;
  }

}
