import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { MemberEntry, PlayerCategoryEntries } from '../../../entity/tabt-soap/TabTAPI_Port';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberService } from '../../../services/members/member.service';
import { TabtHeadersDecorator } from '../../../common/decorators/tabt-headers.decorator';
import {
  GetMember,
  GetMembers,
  GetPlayerCategoriesInput,
  LookupDTO,
  WeeklyNumericRanking,
  WeeklyNumericRankingInput,
  WeeklyNumericRankingInputV2,
  WeeklyNumericRankingV2, WeeklyNumericRankingV3,
} from '../dto/member.dto';
import { PlayerCategory } from '../../../entity/tabt-input.interface';
import { EloMemberService } from '../../../services/members/elo-member.service';
import { SeasonService } from '../../../services/seasons/season.service';
import { MembersSearchIndexService } from '../../../services/members/members-search-index.service';
import { MemberCategoryService } from '../../../services/members/member-category.service';
import { getSimplifiedPlayerCategory } from '../helpers/player-category-helpers';

@ApiTags('Members')
@Controller({
  path: 'members',
  version: '1',
})
export class MemberController {

  constructor(
    private readonly memberService: MemberService,
    private readonly memberCategoryService: MemberCategoryService,
    private readonly eloMemberService: EloMemberService,
    private readonly seasonService: SeasonService,
    private readonly membersSearchIndexService: MembersSearchIndexService,
  ) {
  }

  @Get()
  @ApiOperation({
    operationId: 'findAllMembers',
  })
  @ApiOkResponse({
    type: [MemberEntry],
    description: 'List of players found with specific search criterias',
  })
  @TabtHeadersDecorator()
  async findAll(
    @Query() input: GetMembers,
  ): Promise<MemberEntry[]> {
    return this.memberService.getMembers(
      {
        Club: input.club,
        PlayerCategory: PlayerCategory[input.playerCategory],
        UniqueIndex: input.uniqueIndex,
        NameSearch: input.nameSearch,
        ExtendedInformation: (input.extendedInformation as unknown as string) === 'true',
        RankingPointsInformation: (input.rankingPointsInformation as unknown as string) === 'true',
        WithResults: (input.withResults as unknown as string) === 'true',
        WithOpponentRankingEvaluation: (input.withOpponentRankingEvaluation as unknown as string) === 'true',
      },
    );
  }


  @Get('lookup')
  @ApiOperation({
    operationId: 'findAllMembersLookup',
  })
  @ApiOkResponse({
    type: [MemberEntry],
    description: 'Quick search of a player',
  })
  async searchName(
    @Query() params: LookupDTO,
  ): Promise<any> {
    return this.membersSearchIndexService.search(params.query);
  }

  @Get('categories')
  @ApiOkResponse({
    type: MemberEntry,
    description: 'The categories of a specific player',
  })
  @ApiOperation({
    operationId: 'findMemberCategories',
  })
  @ApiNotFoundResponse()
  @TabtHeadersDecorator()
  @UseInterceptors(ClassSerializerInterceptor)
  async findMemberCategoriesById(
    @Query() input: GetPlayerCategoriesInput,
  ): Promise<PlayerCategoryEntries[]> {
    return await this.memberCategoryService.getMembersCategories({
      UniqueIndex: input.uniqueIndex?.toString(10),
      ShortNameSearch: input.shortNameSearch,
      RankingCategory: input.rankingCategory,
    });
  }

  @Get(':uniqueIndex')
  @ApiOkResponse({
    type: MemberEntry,
    description: 'The information of a specific player',
  })
  @ApiOperation({
    operationId: 'findMemberById',
  })
  @ApiNotFoundResponse()
  @TabtHeadersDecorator()
  @UseInterceptors(ClassSerializerInterceptor)
  async findById(
    @Query() input: GetMember,
    @Param('uniqueIndex', ParseIntPipe) id: number,
  ): Promise<MemberEntry> {
    const found = await this.memberService.getMembers({
      Club: input.club,
      PlayerCategory: PlayerCategory[input.playerCategory],
      UniqueIndex: id,
      NameSearch: input.nameSearch,
      ExtendedInformation: (input.extendedInformation as unknown as string) === 'true',
      RankingPointsInformation: (input.rankingPointsInformation as unknown as string) === 'true',
      WithResults: (input.withResults as unknown as string) === 'true',
      WithOpponentRankingEvaluation: (input.withOpponentRankingEvaluation as unknown as string) === 'true',
    });
    if (found.length === 1) {
      return found[0];
    }
    throw new NotFoundException();
  }

  @Get(':uniqueIndex/numeric-rankings')
  @ApiOkResponse({
    type: [WeeklyNumericRanking],
    description: 'The list of ELO points for a player in a season',
  })
  @ApiOperation({
    operationId: 'findMemberNumericRankingsHistory',
    deprecated: true,
  })
  @ApiNotFoundResponse({
    description: 'No points found for given player',
  })
  @Version('1')
  async findNumericRankings(
    @Param('uniqueIndex', ParseIntPipe) id: number,
    @Query() { season, category }: WeeklyNumericRankingInput,
  ) {
    if (!season) {
      const currentSeason = await this.seasonService.getCurrentSeason();
      season = currentSeason.Season;
    }
    const elos = await this.eloMemberService.getBelNumericRanking(id, season, getSimplifiedPlayerCategory(category));
    if (elos.length) {
      return elos;
    } else {
      throw new NotFoundException('No ELO points found');
    }
  }

  @Get(':uniqueIndex/numeric-rankings')
  @ApiOkResponse({
    type: [WeeklyNumericRankingV2],
    description: 'The list of ELO points for a player in a season',
  })
  @ApiOperation({
    operationId: 'findMemberNumericRankingsHistoryV2',
  })
  @ApiNotFoundResponse({
    description: 'No points found for given player',
  })
  @Version('2')
  async findNumericRankingV2(
    @Param('uniqueIndex', ParseIntPipe) id: number,
    @Query() params: WeeklyNumericRankingInputV2,
  ) {
    const simplifiedCategory = getSimplifiedPlayerCategory(params.category);
    const points = await this.eloMemberService.getBelNumericRankingV2(id, simplifiedCategory);
    if (points.length) {
      return points;
    } else {
      throw new NotFoundException('No ELO points found');
    }
  }

  @Get(':uniqueIndex/numeric-rankings')
  @ApiOkResponse({
    type: WeeklyNumericRankingV3,
    description: 'The list of ELO points for a player in a season',
  })
  @ApiOperation({
    operationId: 'findMemberNumericRankingsHistoryV3',
  })
  @ApiNotFoundResponse({
    description: 'No points found for given player',
  })
  @Version('3')
  async findNumericRankingV3(
    @Param('uniqueIndex', ParseIntPipe) id: number,
    @Query() params: WeeklyNumericRankingInputV2,
  ) {
    const simplifiedCategory = getSimplifiedPlayerCategory(params.category);
    const numericRankingV3 = await this.eloMemberService.getBelNumericRankingV3(id, simplifiedCategory);

    if (!numericRankingV3.points.length) {
      throw new NotFoundException('No ELO points found');
    }
    return numericRankingV3;

  }

}
