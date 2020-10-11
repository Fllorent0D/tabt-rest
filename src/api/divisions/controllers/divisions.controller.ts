import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  DivisionEntry,
  GetDivisionRankingInput,
  GetDivisionsInput,
  RankingEntry,
} from '../../../entity/tabt/TabTAPI_Port';
import { DivisionService } from '../providers/division.service';
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TabtException } from '../../../common/filter/tabt-exceptions.filter';
import { DivisionRankingService } from '../providers/division-ranking.service';
import { TabtHeadersDecorator } from '../../../common/decorators/tabt-headers.decorator';

@Controller('divisions')
@TabtHeadersDecorator()
@ApiTags('Divisions')
export class DivisionsController {

  constructor(
    private divisionService: DivisionService,
    private divisionRankingService: DivisionRankingService,
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
  findAll(
    @Query() query: GetDivisionsInput,
  ): Promise<DivisionEntry[]> {
    return this.divisionService.getDivisionsAsync(query );
  }

  @Get(':DivisionId')
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
    @Param('DivisionId', ParseIntPipe) id: number,
    @Query() query: GetDivisionsInput,
  ): Promise<DivisionEntry> {
    const division = await this.divisionService.getDivisionsByIdAsync(id, query );
    if (!division) {
      throw new NotFoundException();
    }
    return division;
  }

  @Get(':DivisionId/ranking')
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
    @Param('DivisionId', ParseIntPipe) id: number,
    @Query() query: GetDivisionRankingInput,
  ): Promise<RankingEntry[]> {
    return this.divisionRankingService.getDivisionRanking(id, query );
  }

  @Get(':DivisionId/matches')
  @ApiResponse({
    description: 'The ranking for a specific division based on the id of the division.',
    type: [RankingEntry],
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  async findMatchesDivision(
    @Param('DivisionId', ParseIntPipe) id: number,
    @Query() query: GetDivisionRankingInput,
  ): Promise<RankingEntry[]> {
    return this.divisionRankingService.getDivisionRanking(id, query);
  }

}
