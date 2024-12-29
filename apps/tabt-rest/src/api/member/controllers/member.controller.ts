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
  GetMembersV2,
  GetMemberV2,
  GetPlayerCategoriesInput,
  LookupDTO,
  MemberEntryDTO,
  WeeklyNumericRanking,
  WeeklyNumericRankingInput,
  WeeklyNumericRankingInputV2,
  WeeklyNumericRankingInputV5,
  WeeklyNumericRankingV2,
  WeeklyNumericRankingV3,
} from '../dto/member.dto';
import { PlayerCategory } from '../../../entity/tabt-input.interface';
import { SeasonService } from '../../../services/seasons/season.service';
import { MembersSearchIndexService } from '../../../services/members/members-search-index.service';
import { MemberCategoryService } from '../../../services/members/member-category.service';
import { getSimplifiedPlayerCategory as getPlayerCategory } from '../helpers/player-category-helpers';
import { NumericRankingService } from '../../../services/members/numeric-ranking.service';

@ApiTags('Members')
@Controller({
  path: 'members',
  version: '1',
})
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly memberCategoryService: MemberCategoryService,
    private readonly seasonService: SeasonService,
    private readonly membersSearchIndexService: MembersSearchIndexService,
    private readonly numericRankingService: NumericRankingService,
  ) {}

  @Get()
  @ApiOperation({
    operationId: 'findAllMembers',
    deprecated: true,
  })
  @ApiOkResponse({
    type: [MemberEntry],
    description: 'List of players found with specific search criterias',
  })
  @TabtHeadersDecorator()
  async findAll(@Query() input: GetMembers): Promise<MemberEntry[]> {
    return this.memberService.getMembers({
      Club: input.club,
      PlayerCategory: PlayerCategory[input.playerCategory],
      UniqueIndex: input.uniqueIndex,
      NameSearch: input.nameSearch,
      ExtendedInformation:
        (input.extendedInformation as unknown as string) === 'true',
      RankingPointsInformation:
        (input.rankingPointsInformation as unknown as string) === 'true',
      WithResults: (input.withResults as unknown as string) === 'true',
      WithOpponentRankingEvaluation:
        (input.withOpponentRankingEvaluation as unknown as string) === 'true',
    });
  }
  
  
  @Get()
  @ApiOperation({
    operationId: 'findAllMembersV2',
  })
  @ApiOkResponse({
    type: [MemberEntry],
    description: 'List of players found with specific search criterias',
  })
  @Version('2')
  @TabtHeadersDecorator()
  async findAllV2(@Query() input: GetMembersV2): Promise<MemberEntryDTO[]> {
    const members = await this.memberService.getMembersV2(input);
    if (members.length === 0) {
      throw new NotFoundException('No members found');
    }
    return members.map(MemberEntryDTO.fromTabT);
  }



  @Get('lookup')
  @ApiOperation({
    operationId: 'findAllMembersLookup',
    deprecated: true,
  })
  @ApiOkResponse({
    type: [MemberEntry],
    description: 'Quick search of a player',
  })
  async searchName(@Query() params: LookupDTO): Promise<any> {
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
    deprecated: true,
  })
  @ApiNotFoundResponse()
  @TabtHeadersDecorator()
  @Version('1')
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
      ExtendedInformation:
        (input.extendedInformation as unknown as string) === 'true',
      RankingPointsInformation:
        (input.rankingPointsInformation as unknown as string) === 'true',
      WithResults: (input.withResults as unknown as string) === 'true',
      WithOpponentRankingEvaluation:
        (input.withOpponentRankingEvaluation as unknown as string) === 'true',
    });
    if (found.length === 1) {
      return found[0];
    }
    throw new NotFoundException();
  }
  
  @Get(':uniqueIndex')
  @ApiOkResponse({
    type: MemberEntry,
    description: 'The information of a specific player',
  })
  @ApiOperation({
    operationId: 'findMemberByIdV2',
  })
  @ApiNotFoundResponse()
  @TabtHeadersDecorator()
  @UseInterceptors(ClassSerializerInterceptor)
  @Version('2')
  async findByIdV2(
    @Query() input: GetMemberV2,
    @Param('uniqueIndex', ParseIntPipe) id: number,
  ): Promise<MemberEntry> {
    const members = await this.memberService.getMembersV2({
      ...input,
      uniqueIndex: id,
    });
    if (members.length === 1) {
      return members[0];
    }
    throw new NotFoundException();
  }


  @Get(':uniqueIndex/numeric-rankings')
  @ApiOkResponse({
    type: WeeklyNumericRankingV3,
    description: 'The list of ELO points for a player in a season',
  })
  @ApiOperation({
    operationId: 'findMemberNumericRankingsHistoryV3',
    deprecated: true,
  })
  @ApiNotFoundResponse({
    description: 'No points found for given player',
  })
  @Version('3')
  async findNumericRankingV3(
    @Param('uniqueIndex', ParseIntPipe) id: number,
    @Query() params: WeeklyNumericRankingInputV2,
  ) {
    const simplifiedCategory = getPlayerCategory(params.category);
    return await this.numericRankingService.getWeeklyRankingV4(
      id,
      simplifiedCategory,
    );
  }

  @Get(':uniqueIndex/numeric-rankings')
  @ApiOkResponse({
    type: WeeklyNumericRankingV3,
    description: 'The list of ELO points for a player in a season',
  })
  @ApiOperation({
    operationId: 'findMemberNumericRankingsHistoryV4',
    deprecated: true,
  })
  @ApiNotFoundResponse({
    description: 'No points found for given player',
  })
  @Version('4')
  async findNumericRankingV4(
    @Param('uniqueIndex', ParseIntPipe) id: number,
    @Query() params: WeeklyNumericRankingInputV2,
  ) {
    return await this.numericRankingService.getWeeklyRankingV4(
      id,
      getPlayerCategory(params.category),
    );
  }
  
  @Get(':uniqueIndex/numeric-rankings')
  @ApiOkResponse({
    type: WeeklyNumericRankingV3,
    description: 'The list of ELO points for a player in a season',
  })
  @ApiOperation({
    operationId: 'findMemberNumericRankingsHistoryV5',
  })
  @ApiNotFoundResponse({
    description: 'No points found for given player',
  })
  @Version('5')
  async findNumericRankingV5(
    @Param('uniqueIndex', ParseIntPipe) id: number,
    @Query() params: WeeklyNumericRankingInputV5,
  ) {
    return await this.numericRankingService.getWeeklyRankingV4(
      id,
      params.category,
    );
  }
}
