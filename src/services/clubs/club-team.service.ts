import { Injectable, Logger } from '@nestjs/common';
import { GetClubTeamsInput, TeamEntry } from '../../entity/tabt-soap/TabTAPI_Port';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';


@Injectable()
export class ClubTeamService {
  private readonly logger = new Logger('ClubTeamService', true);

  constructor(
    private tabtClient: TabtClientService,
  ) {
  }

  async getClubsTeams(input: GetClubTeamsInput): Promise<TeamEntry[]> {
    const [result] = await this.tabtClient.GetClubTeamsAsync(input);
    return result.TeamEntries;
  }
}
