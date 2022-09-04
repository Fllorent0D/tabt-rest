import { Injectable, Logger } from '@nestjs/common';
import {
  GetMembersInput,
  GetPlayerCategoriesInput,
  MemberEntry,
  PlayerCategoryEntries,
} from '../../entity/tabt-soap/TabTAPI_Port';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';
import { ContextService } from '../../common/context/context.service';
import { HeaderKeys } from '../../common/context/context.constants';
import { PlayerCategory } from '../../entity/tabt-input.interface';
import { MemberEntries } from '../../api/member/dto/member.dto';


@Injectable()
export class MemberService {
  private readonly logger = new Logger('MemberService');

  constructor(
    private tabtClient: TabtClientService,
    private contextService: ContextService,
  ) {
  }

  async getMembers(input: GetMembersInput): Promise<MemberEntry[]> {
    // TODO: Refactor and get dynamically the correct ID to send. Cache?
    // Add facade for the app to minimize the breaking changes in the future
    // The app should only be able specific categories.
    // Maybe refactor with a new aggregator route that returns all info to the app
    // encapsulate all that logic into the bff

    if (Number(this.contextService.context.caller[HeaderKeys.X_TABT_SEASON]) === 23 || (!this.contextService.context.caller[HeaderKeys.X_TABT_SEASON] && this.contextService.context.runner.season === 23)) {
      if (input.PlayerCategory === PlayerCategory.MEN) {
        input.PlayerCategory = PlayerCategory.MEN_POST_23;
      } else if (input.PlayerCategory === PlayerCategory.WOMEN) {
        input.PlayerCategory = PlayerCategory.WOMEN_POST_23;
      } else if (input.PlayerCategory === PlayerCategory.YOUTH) {
        input.PlayerCategory = PlayerCategory.YOUTH_POST_23;
      }
    }
    const result = await this.tabtClient.GetMembersAsync(input);
    if (result.MemberCount === 0) {
      return [];
    }
    return result.MemberEntries;
  }


}
