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
import {
  DivisionEntry,
  RankingEntry,
  TeamMatchesEntry,
} from '../../../entity/tabt-soap/TabTAPI_Port';
import { DivisionService } from '../../../services/divisions/division.service';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiExtraModels,
} from '@nestjs/swagger';
import { TabtException } from '../../../common/filter/tabt-exceptions.filter';
import { DivisionRankingService } from '../../../services/divisions/division-ranking.service';
import { TabtHeadersDecorator } from '../../../common/decorators/tabt-headers.decorator';
import {
  DivisionEntryDto,
  GetDivisionMatches,
  GetDivisionRanking,
  GetDivisionsV1,
  GetDivisionsV2,
} from '../dto/divisions.dto';
import { MatchService } from '../../../services/matches/match.service';
import { Level } from '../../../entity/tabt-input.interface';
import { MatchesMembersRankerService } from '../../../services/matches/matches-members-ranker.service';
import { MemberResults } from '../../../common/dto/member-ranking.dto';
import { PlayerCategory } from '../../../entity/tabt-input.interface';
import { LevelDTO, mapLevelDTOToLevels, mapLevelToLevelDTO } from '../../../common/dto/levels.dto';
import { mapPlayerCategoryToPlayerCategoryDTO, playerCategoryDTOToPlayerCategory, playerCategoryToPlayerCategoryDTO } from 'apps/tabt-rest/src/common/dto/player-category.dto';
import { divisionCategoryDTOToDivisionCategory, mapDivisionCategoryToDivisionCategoryDTO } from 'apps/tabt-rest/src/common/dto/division-category.dto';
@Controller({
  path: 'divisions',
  version: ['1'],
})
@TabtHeadersDecorator()
@ApiTags('Divisions')
@ApiExtraModels(DivisionEntryDto)
export class DivisionsController {
  constructor(
    private divisionService: DivisionService,
    private divisionRankingService: DivisionRankingService,
    private matchesService: MatchService,
    private matchesMembersRankerService: MatchesMembersRankerService,
  ) {}

 @Get()
  @ApiOperation({
    operationId: 'findAllDivisions',
    deprecated: true,
  })
  @ApiResponse({
    description: 'List of divisions for a specific season.',
    type: [DivisionEntry],
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  @Version('1')
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Query() query: GetDivisionsV1): Promise<DivisionEntry[]> {
    return this.divisionService.getDivisions({
      Level: query.level ? Number(Level[query.level]) : undefined,
      ShowDivisionName: query.showDivisionName,
    });
  }

  @Get()
  @ApiOperation({
    operationId: 'findAllDivisionsV2',
    summary: 'List of divisions for a specific season with enum string values.',
  })
  @ApiResponse({
    description: 'List of divisions for a specific season with enum string values.',
    type: [DivisionEntryDto],
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Version('2')
  async getDivisionsV2(
    @Query() query: GetDivisionsV2,
  ): Promise<DivisionEntryDto[]> {
    const divisions = await this.divisionService.getDivisionsV2(query);
    return divisions.map(DivisionEntryDto.fromDivisionEntry);
  }

  @Get(':divisionId')
  @ApiOperation({
    operationId: 'findDivisionById',
    summary: 'Find a division by id',
    deprecated: true,
  })
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
  @UseInterceptors(ClassSerializerInterceptor)
  @Version('1')
  async findOne(
    @Param('divisionId', ParseIntPipe) id: number,
    @Query() query: GetDivisionsV1,
  ): Promise<DivisionEntry> {
    const division = await this.divisionService.getDivisionsById(id, {
      ShowDivisionName: query.showDivisionName,
    });
    if (!division) {
      throw new NotFoundException();
    }
    return division;
  }

  
  @Get(':divisionId')
  @ApiOperation({
    operationId: 'findDivisionByIdV2',
  })
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
  @UseInterceptors(ClassSerializerInterceptor)
  @Version('2')
  async findOneV2(
    @Param('divisionId', ParseIntPipe) id: number,
  ): Promise<DivisionEntryDto> {
    const division = await this.divisionService.getDivisionByIdV2(id);
    if (!division) {
      throw new NotFoundException();
    }
    return DivisionEntryDto.fromDivisionEntry(division);
  }
  

  @Get(':divisionId/ranking')
  @ApiOperation({
    operationId: 'findDivisionRanking',
  })
  @ApiResponse({
    description:
      'The ranking for a specific division based on the id of the division.',
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
      WeekName: query.weekName,
    });
  }

  @Get(':divisionId/matches')
  @ApiOperation({
    operationId: 'findDivisionMatches',
  })
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
      /*
      WeekName: query.weekName,
      YearDateFrom: query.yearDateFrom,
      YearDateTo: query.yearDateTo,
      WithDetails: query.withDetails,
      */
    });
  }

  @Get(':divisionId/members/ranking')
  @ApiOperation({
    operationId: 'findDivisionMembers',
  })
  @ApiResponse({
    description: 'A ranking of members playing in a given division.',
    type: [MemberResults],
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  async findMembersInDivision(
    @Param('divisionId', ParseIntPipe) id: number,
  ): Promise<MemberResults[]> {
    return this.matchesMembersRankerService.getMembersRankingFromDivision(id);
  }
}
