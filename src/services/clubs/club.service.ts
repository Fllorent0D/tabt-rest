import { Injectable, Logger } from '@nestjs/common';
import { ClubEntry, GetClubsInput } from '../../entity/tabt-soap/TabTAPI_Port';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';


@Injectable()
export class ClubService {

  constructor(
    private tabtClient: TabtClientService,
  ) {
  }

  async getClubs(input: GetClubsInput): Promise<ClubEntry[]> {
    const [result] = await this.tabtClient.GetClubsAsync(input);
    return result.ClubEntries;
  }

  async getClubById(input: GetClubsInput, uniqueIndex: string): Promise<ClubEntry | undefined> {
    const clubs = await this.getClubs(input);
    return clubs.find((club) => club.UniqueIndex === uniqueIndex);
  }
}
