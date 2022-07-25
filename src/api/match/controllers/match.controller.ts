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
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MatchSystemEntry, TeamMatchesEntry } from '../../../entity/tabt-soap/TabTAPI_Port';
import { MatchService } from '../../../services/matches/match.service';
import { TabtHeadersDecorator } from '../../../common/decorators/tabt-headers.decorator';
import { MatchSystemService } from '../../../services/matches/match-system.service';
import { GetMatch, GetMatches } from '../dto/match.dto';
import { Level, PlayerCategory } from '../../../entity/tabt-input.interface';

@ApiTags('Matches')
@Controller({
  path: 'matches',
  version: '1',
})
@TabtHeadersDecorator()
@UseInterceptors(ClassSerializerInterceptor)
export class MatchController {
  constructor(
    private matchService: MatchService,
    private matchSystemService: MatchSystemService,
  ) {
  }

  @Get()
  @ApiOperation({
    operationId: 'findAllMatches',
  })
  @ApiOkResponse({
    type: [TeamMatchesEntry],
    description: 'List of team matches entries',
  })

  async findAll(
    @Query() input: GetMatches,
  ): Promise<TeamMatchesEntry[]> {
    return this.matchService.getMatches({
      DivisionId: input.divisionId,
      Club: input.club,
      Team: input.team,
      DivisionCategory: PlayerCategory[input.divisionCategory] as unknown as number,
      WeekName: input.weekName,
      Level: Level[input.level] as unknown as number,
      ShowDivisionName: input.showDivisionName,
      YearDateTo: input.yearDateTo,
      YearDateFrom: input.yearDateFrom,
      WithDetails: input.withDetails,
      MatchId: input.matchId,
      MatchUniqueId: input.matchUniqueId as unknown as number,
    });
  }

  @Get('systems')
  @ApiOperation({
    operationId: 'findAllMatchSystems',
  })
  @ApiOkResponse({
    type: [MatchSystemEntry],
    description: 'The list of match system',
  })
  async findMatchSystem(): Promise<MatchSystemEntry[]> {
    return this.matchSystemService.getMatchSystems();
  }

  @Get('systems/:matchSystemId')
  @ApiOperation({
    operationId: 'findMatchSystemById',
  })
  @ApiOkResponse({
    type: MatchSystemEntry,
    description: 'A specific match system',
  })
  @ApiNotFoundResponse()
  async findMatchSystemById(
    @Param('matchSystemId', ParseIntPipe) id: number,
  ): Promise<MatchSystemEntry> {
    const matchSystem = await this.matchSystemService.getMatchSystemsById(id);
    if (matchSystem) {
      return matchSystem;
    }
    throw new NotFoundException();
  }

  @Get(':matchUniqueId')
  @ApiOperation({
    operationId: 'findMatchById',
  })
  @ApiOkResponse({
    type: TeamMatchesEntry,
    description: 'The information of a specific match',
  })
  @ApiNotFoundResponse()
  async findById(
    @Query() input: GetMatch,
    @Param('matchUniqueId', ParseIntPipe) id: number,
  ): Promise<TeamMatchesEntry> {
    const found = await this.matchService.getMatches({
      DivisionId: input.divisionId,
      Club: input.club,
      Team: input.team,
      DivisionCategory: PlayerCategory[input.divisionCategory] as unknown as number,
      WeekName: input.weekName,
      Level: Level[input.level] as unknown as number,
      ShowDivisionName: input.showDivisionName,
      YearDateTo: input.yearDateTo,
      YearDateFrom: input.yearDateFrom,
      WithDetails: input.withDetails,
      MatchId: input.matchId,
      MatchUniqueId: id,
    });

    if (found.length) {
      return found[0];
    }
    throw new NotFoundException();
  }


}
