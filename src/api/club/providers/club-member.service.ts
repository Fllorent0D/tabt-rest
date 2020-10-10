import { Injectable, Logger } from '@nestjs/common';
import { GetMembersInput, MemberEntry } from '../../../entity/tabt/TabTAPI_Port';
import { TabtClientService } from '../../../common/tabt-client/tabt-client.service';

@Injectable()
export class ClubMemberService {
  private readonly logger = new Logger('ClubMemberService', true);

  constructor(
    private tabtClient: TabtClientService,
  ) {
  }

  async getClubsMembers(input: GetMembersInput): Promise<MemberEntry[]> {
    const [result] = await this.tabtClient.GetMembersAsync(input);
    return result.MemberEntries;
  }
}
