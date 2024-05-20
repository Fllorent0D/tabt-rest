import { Injectable, Logger } from '@nestjs/common';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';
import { MatchSystemEntry } from '../../entity/tabt-soap/TabTAPI_Port';

@Injectable()
export class MatchSystemService {
  private readonly logger = new Logger('ClubTeamService');

  constructor(
    private tabtClient: TabtClientService,
  ) {
  }

  async getMatchSystems(): Promise<MatchSystemEntry[]> {
    const response = await this.tabtClient.GetMatchSystemsAsync({});
    return response.MatchSystemEntries;
  }

  async getMatchSystemsById(id: number): Promise<MatchSystemEntry | null> {
    const response = await this.tabtClient.GetMatchSystemsAsync({ UniqueIndex: id });
    if (response.MatchSystemEntries?.length === 1) {
      return response.MatchSystemEntries[0];
    }
    return null;
  }


}
