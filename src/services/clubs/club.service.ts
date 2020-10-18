import { Injectable, Logger } from '@nestjs/common';
import { ClubEntry, GetClubsInput } from '../../entity/tabt-soap/TabTAPI_Port';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';

const CACHE_KEY = 'CLUBS-';

@Injectable()
export class ClubService {
  private readonly logger = new Logger('ClubService', true);

  constructor(
    private tabtClient: TabtClientService,
  ) {
  }

  async getClubs(input: GetClubsInput): Promise<ClubEntry[]> {
    const [result] = await this.tabtClient.GetClubsAsync(input);
    return result.ClubEntries
  }

  async getClubsById(input: GetClubsInput, uniqueIndex: string): Promise<ClubEntry> {
    const clubs = await this.getClubs(input);
    return clubs.find((club) => club.UniqueIndex === uniqueIndex);
  }


}
