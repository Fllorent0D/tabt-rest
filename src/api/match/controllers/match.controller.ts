import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MatchSystemEntry, MemberEntry, TeamMatchesEntry } from '../../../entity/tabt-soap/TabTAPI_Port';
import { MatchService } from '../../../services/matches/match.service';
import { TabtHeadersDecorator } from '../../../common/decorators/tabt-headers.decorator';
import { ContextService } from '../../../common/context/context.service';
import { MatchSystemService } from '../../../services/matches/match-system.service';
import { GetMatches } from '../dto/match.dto';
import { Level, PlayerCategory } from '../../../entity/tabt-input.interface';

@ApiTags('Matches')
@Controller('matches')
@TabtHeadersDecorator()
export class MatchController {
  constructor(
    private matchService: MatchService,
    private matchSystemService: MatchSystemService,
    private contextServicetest: ContextService,
  ) {
  }

  @Get()
  @ApiOkResponse({
    type: [TeamMatchesEntry],
    description: 'List of team matches entries',
  })
  async findAll(
    @Query() input: GetMatches,
  ): Promise<TeamMatchesEntry[]> {
    console.log(this.contextServicetest.context);
    return this.matchService.getMatches({
      DivisionId: input.divisionId,
      Club: input.club,
      Team: input.team,
      DivisionCategory: PlayerCategory[input.divisionCategory] as unknown as number,
      Season: input.season,
      WeekName: input.weekName,
      Level: Level[input.level] as unknown as number,
      ShowDivisionName: input.showDivisionName,
      YearDateTo: input.yearDateTo,
      YearDateFrom: input.yearDateFrom,
      WithDetails: input.withDetails,
      MatchId: input.matchId,
      MatchUniqueId: input.matchUniqueId
    });
  }

  @Get('systems')
  @ApiOkResponse({
    type: [MatchSystemEntry],
    description: 'The list of match system',
  })
  async findMatchSystem(): Promise<MatchSystemEntry[]> {
    return this.matchSystemService.getMatchSystems();
  }

  @Get('systems/:matchSystemId')
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
  @ApiOkResponse({
    type: MemberEntry,
    description: 'The information of a specific player',
  })
  @ApiNotFoundResponse()
  async findById(
    @Query() input: GetMatches,
    @Param('matchUniqueId') id: string,
  ): Promise<TeamMatchesEntry> {
    const found = await this.matchService.getMatches({
      DivisionId: input.divisionId,
      Club: input.club,
      Team: input.team,
      DivisionCategory: PlayerCategory[input.divisionCategory] as unknown as number,
      Season: input.season,
      WeekName: input.weekName,
      Level: Level[input.level] as unknown as number,
      ShowDivisionName: input.showDivisionName,
      YearDateTo: input.yearDateTo,
      YearDateFrom: input.yearDateFrom,
      WithDetails: input.withDetails,
      MatchId: input.matchId,
      MatchUniqueId: id
    });

    if (found.length === 1) {
      return found[0];
    }
    throw new NotFoundException();
  }


}
