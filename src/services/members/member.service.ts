import { Injectable, Logger } from '@nestjs/common';
import { GetMembersInput, MemberEntry } from '../../entity/tabt-soap/TabTAPI_Port';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';


@Injectable()
export class MemberService {
  private readonly logger = new Logger('MemberService', true);

  constructor(
    private tabtClient: TabtClientService,
  ) {
  }

  async getMembers(input: GetMembersInput): Promise<MemberEntry[]> {
    const result = await this.tabtClient.GetMembersAsync(input);
    if (result.MemberCount === 0) {
      return [];
    }
    return result.MemberEntries;
  }
}
