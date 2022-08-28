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
    // Add facade for the app to minimize the breaking change
    // The app should only be able specific categories.
    // Maybe refactor with a new aggregator route that returns all info to the app

    if (Number(this.contextService.context.caller[HeaderKeys.X_TABT_SEASON]) === 23) {
      if (input.PlayerCategory === PlayerCategory.MEN) {
        input.PlayerCategory = PlayerCategory.MEN_POST_23;
      } else if (input.PlayerCategory === PlayerCategory.WOMEN) {
        input.PlayerCategory = PlayerCategory.WOMEN_POST_23;
      }
    }
    const result = await this.tabtClient.GetMembersAsync(input);
    if (result.MemberCount === 0) {
      return [];
    }
    return result.MemberEntries;
  }

  async getMembersCategories(input: GetPlayerCategoriesInput): Promise<PlayerCategoryEntries[]> {
    const { PlayerCategoryEntries, PlayerCategoryCount } = await this.tabtClient.GetMembersCategoriesAsync(input);
    console.log(PlayerCategoryCount, PlayerCategoryEntries);
    if (PlayerCategoryCount === 0) {
      return [];
    }
    return PlayerCategoryEntries;
  }
}
