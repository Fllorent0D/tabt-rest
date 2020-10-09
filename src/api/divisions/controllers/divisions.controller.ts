import {
  CacheInterceptor,
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
  GetDivisionRankingInput,
  RankingEntry, Credentials,
} from '../../../entity/tabt/TabTAPI_Port';
import { DivisionService } from '../providers/division.service';
import { ApiHeaders, ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TabtException } from '../../../common/filter/tabt-exceptions.filter';
import { DivisionRankingService } from '../providers/division-ranking.service';
import { TabtHeaders } from '../../../common/headers/tabt-headers';
import { TabtCredentials } from '../../../common/decorators/TabtCredentials.decorator';

@Controller('divisions')
@TabtHeaders()
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
    @TabtCredentials() credentials: Credentials,
  ): Promise<DivisionEntry[]> {
    return this.divisionService.getDivisionsAsync({ ...query, Credentials: credentials });
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
    @TabtCredentials() credentials: Credentials,
  ): Promise<DivisionEntry> {
    const division = await this.divisionService.getDivisionsByIdAsync(id, { ...query, Credentials: credentials });
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
    @TabtCredentials() credentials: Credentials,
  ): Promise<RankingEntry[]> {
    return this.divisionRankingService.getDivisionRanking(id, { ...query, Credentials: credentials });
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
    @TabtCredentials() credentials: Credentials,
  ): Promise<RankingEntry[]> {
    return this.divisionRankingService.getDivisionRanking(id, { ...query, Credentials: credentials });
  }

}
