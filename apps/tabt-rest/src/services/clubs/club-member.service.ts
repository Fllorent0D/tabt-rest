import { Injectable } from '@nestjs/common';
import { GetMembersInput, MemberEntry } from '../../entity/tabt-soap/TabTAPI_Port';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';

@Injectable()
export class ClubMemberService {
  constructor(
    private tabtClient: TabtClientService,
  ) {
  }

  async getClubsMembers(input: GetMembersInput): Promise<MemberEntry[]> {
    const result = await this.tabtClient.GetMembersAsync(input);
    return result.MemberEntries ?? [];
  }
}
