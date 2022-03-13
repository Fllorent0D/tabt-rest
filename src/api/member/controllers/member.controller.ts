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
import { MemberEntry } from '../../../entity/tabt-soap/TabTAPI_Port';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberService } from '../../../services/members/member.service';
import { TabtHeadersDecorator } from '../../../common/decorators/tabt-headers.decorator';
import {
  GetMember,
  GetMembers,
  WeeklyELO,
  WeeklyNumericRanking,
  WeeklyNumericRankingInput,
  WeeklyNumericRankingV2,
} from '../dto/member.dto';
import { PlayerCategory } from '../../../entity/tabt-input.interface';
import { EloMemberService } from '../../../services/members/elo-member.service';
import { RequestBySeasonDto } from '../../../common/dto/request-by-season.dto';
import { SeasonService } from '../../../services/seasons/season.service';
import { ElasticSearchService } from '../../../common/elastic/elastic-search.service';

@ApiTags('Members')
@Controller({
  path: 'members',
  version: '1',
})

export class MemberController {

  constructor(
    private memberService: MemberService,
    private eloMemberService: EloMemberService,
    private seasonService: SeasonService,
    private readonly elasticSearch: ElasticSearchService,
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
    @Query('query') query: string,
  ): Promise<any> {
    /*
    const result = await this.elasticSearch.client.searchTemplate({
      id: 'searchMember',
      index: 'members',
      params: { 'query_string': query },
    });
    */
    const result = await this.elasticSearch.client.search({
      size: 50,
      query: {
        multi_match: {
          'query': query,
          'operator': 'and',
          'boost': 1,
          'type': 'bool_prefix',
          'fuzziness': 1,
          'fields': [
            'FullName.search-as-you-type',
            'FullName.search-as-you-type._2gram',
            'FullName.search-as-you-type._3gram',
          ],
        },
      },
    });
    return result.hits.hits.map((hit) => hit._source);
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

  @Get(':uniqueIndex/elo')
  @ApiOkResponse({
    type: [WeeklyELO],
    description: 'The list of ELO points for a player in a season',
  })
  @ApiOperation({
    operationId: 'findMemberEloHistory',
    deprecated: true,
  })
  @ApiNotFoundResponse({
    description: 'No points found for given player',
  })
  async findELOHistory(
    @Param('uniqueIndex', ParseIntPipe) id: number,
    @Query() { season }: RequestBySeasonDto,
  ) {
    if (!season) {
      const currentSeason = await this.seasonService.getCurrentSeason();
      season = currentSeason.Season;
    }
    const elos = await this.eloMemberService.getEloWeekly(id, season);
    if (elos.length) {
      return elos;
    } else {
      throw new NotFoundException('No ELO points found');
    }
  }

  @Get(':uniqueIndex/numeric-rankings')
  @ApiOkResponse({
    type: [WeeklyNumericRanking],
    description: 'The list of ELO points for a player in a season',
  })
  @ApiOperation({
    operationId: 'findMemberNumericRankingsHistory',
  })
  @ApiNotFoundResponse({
    description: 'No points found for given player',
  })
  async findNumericRankings(
    @Param('uniqueIndex', ParseIntPipe) id: number,
    @Query() { season, category }: WeeklyNumericRankingInput,
  ) {
    if (!season) {
      const currentSeason = await this.seasonService.getCurrentSeason();
      season = currentSeason.Season;
    }
    const elos = await this.eloMemberService.getBelNumericRanking(id, season, category);
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
  @Version('2')
  @ApiNotFoundResponse({
    description: 'No points found for given player',
  })
  async findNumericRankingsV2(
    @Param('uniqueIndex', ParseIntPipe) id: number,
    @Query() { season, category }: WeeklyNumericRankingInput,
  ) {
    if (!season) {
      const currentSeason = await this.seasonService.getCurrentSeason();
      season = currentSeason.Season;
    }
    const elos = await this.eloMemberService.getBelNumericRanking(id, season, category);
    if (elos.length) {
      return elos;
    } else {
      throw new NotFoundException('No ELO points found');
    }
  }

}
