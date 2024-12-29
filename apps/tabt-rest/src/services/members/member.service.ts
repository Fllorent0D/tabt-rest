import { Injectable, Logger } from '@nestjs/common';
import {
  GetMembersInput,
  MemberEntry,
} from '../../entity/tabt-soap/TabTAPI_Port';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';
import { ContextService } from '../../common/context/context.service';
import { HeaderKeys } from '../../common/context/context.constants';
import { PlayerCategory } from '../../entity/tabt-input.interface';
import { GetMembersV2 } from '../../api/member/dto/member.dto';
import { mapPlayerCategoryDTOToPlayerCategory, mapPlayerCategoryToPlayerCategoryDTO, PlayerCategoryDTO } from '../../common/dto/player-category.dto';
import { deprecate } from 'util';
import { throwDeprecation } from 'process';

@Injectable()
export class MemberService {
  private readonly logger = new Logger('MemberService');

  constructor(
    private tabtClient: TabtClientService,
    private contextService: ContextService,
  ) {}

  async getMembersV2(query: GetMembersV2): Promise<MemberEntry[]> {
    const result = await this.tabtClient.GetMembersAsync({
      Club: query.club,
      PlayerCategory: mapPlayerCategoryDTOToPlayerCategory(query.playerCategory),
      UniqueIndex: query.uniqueIndex,
      NameSearch: query.nameSearch,
      ExtendedInformation: query.extendedInformation,
      RankingPointsInformation: query.rankingPointsInformation,
      WithResults: query.withResults,
      WithOpponentRankingEvaluation: query.withOpponentRankingEvaluation,
    });
    return result.MemberEntries ?? [];
  }



  /**
   * @deprecated Use getMembersV2 instead
   */
  async getMembers(input: GetMembersInput): Promise<MemberEntry[]> {
    // TODO: Refactor and get dynamically the correct ID to send. Cache?
    // Add facade for the app to minimize the breaking changes in the future
    // The app should only be able specific categories.
    // Maybe refactor with a new aggregator route that returns all info to the app
    // encapsulate all that logic into the bff

    const result = await this.tabtClient.GetMembersAsync(input);
    if (result.MemberCount === 0) {
      return [];
    }
    return result.MemberEntries;
  }
}
