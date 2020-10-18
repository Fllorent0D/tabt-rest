import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  DivisionEntry,
  GetDivisionsInput,
  RankingEntry,
  TeamMatchesEntry,
} from '../../../entity/tabt-soap/TabTAPI_Port';
import { DivisionService } from '../../../services/divisions/division.service';
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TabtException } from '../../../common/filter/tabt-exceptions.filter';
import { DivisionRankingService } from '../../../services/divisions/division-ranking.service';
import { TabtHeadersDecorator } from '../../../common/decorators/tabt-headers.decorator';
import { GetDivisionMatches, GetDivisionRanking, ListAllDivisions } from '../dto/divisions.dto';
import { MatchService } from '../../../services/matches/match.service';
import { Level } from '../../../entity/tabt-input.interface';

@Controller('divisions')
@TabtHeadersDecorator()
@ApiTags('Divisions')
export class DivisionsController {

  constructor(
    private divisionService: DivisionService,
    private divisionRankingService: DivisionRankingService,
    private matchesService: MatchService,
  ) {
  }

  @Get()
  @ApiResponse({
    description: 'List of divisions for a specific season.',
    type: [DivisionEntry],
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  @UseInterceptors(ClassSerializerInterceptor)

  findAll(
    @Query() query: ListAllDivisions,
  ): Promise<DivisionEntry[]> {
    return this.divisionService.getDivisionsAsync({
      Season: query.season,
      Level: Level[query.level],
      ShowDivisionName: query.showDivisionName,
    });
  }

  @Get(':divisionId')
  @ApiResponse({
    description: 'A specific division based on the id.',
    type: DivisionEntry,
    status: 200,
  })
  @ApiNotFoundResponse({ description: 'The division not found' })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  async findOne(
    @Param('divisionId', ParseIntPipe) id: number,
    @Query() query: GetDivisionsInput,
  ): Promise<DivisionEntry> {
    const division = await this.divisionService.getDivisionsByIdAsync(id, query);
    if (!division) {
      throw new NotFoundException();
    }
    return division;
  }

  @Get(':divisionId/ranking')
  @ApiResponse({
    description: 'The ranking for a specific division based on the id of the division.',
    type: [RankingEntry],
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  async findRankingDivision(
    @Param('divisionId', ParseIntPipe) id: number,
    @Query() query: GetDivisionRanking,
  ): Promise<RankingEntry[]> {
    return this.divisionRankingService.getDivisionRanking({
      DivisionId: id,
      RankingSystem: query.rankingSystem,
      WeekName: query.week,
    });
  }

  @Get(':divisionId/matches')
  @ApiResponse({
    description: 'A list of matches.',
    type: [TeamMatchesEntry],
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  async findMatchesDivision(
    @Param('divisionId', ParseIntPipe) id: number,
    @Query() query: GetDivisionMatches,
  ): Promise<TeamMatchesEntry[]> {
    return this.matchesService.getMatches({
      DivisionId: id,
      WeekName: query.weekName,
      YearDateFrom: query.yearDateFrom,
      YearDateTo: query.yearDateTo,
      WithDetails: query.withDetails,
    });
  }

}
