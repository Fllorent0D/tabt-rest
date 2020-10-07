import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GetTournamentsInput,
  IGetTournamentsOutput,
  SeasonEntry,
  TournamentEntry, TournamentSerieEntry,
} from '../../entity/tabt/TabTAPI_Port';
import { TabtException } from '../../common/filter/tabt-exceptions.filter';
import { TournamentService } from '../providers/tournament.service';
import { GetTournamentDTO, GetTournamentsDTO, RegisterTournamentDTO } from '../dto/tournaments.dto';

@ApiTags('Tournaments')
@Controller('tournaments')
export class TournamentController {
  constructor(private tournamentService: TournamentService) {
  }

  @Get()
  @ApiResponse({
    description: 'A list of tournament.',
    type: [TournamentEntry],
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  findAll(@Query() input: GetTournamentsDTO) {
    return this.tournamentService.getTournaments(input as GetTournamentsInput);
  }

  @Get(':tournamentId')
  @ApiResponse({
    description: 'A specific tournament.',
    type: TournamentEntry,
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  async findById(@Query() input: GetTournamentDTO, @Param('tournamentId', ParseIntPipe) id: number) {
    const result = await this.tournamentService.getTournaments({ ...input, TournamentUniqueIndex: id });
    if (result.length === 1) {
      return result[0];
    }
    throw new NotFoundException();
  }

  @Get(':tournamentId/series')
  @ApiResponse({
    description: 'A specific tournament.',
    type: [TournamentSerieEntry],
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  async getSeries(@Param('tournamentId', ParseIntPipe) id: number) {
    const result = await this.tournamentService.getTournaments({ TournamentUniqueIndex: id, WithRegistrations: true });
    if (result.length === 1) {
      return result[0].SerieEntries;
    }
    throw new NotFoundException();
  }

  @Post(':tournamentId/serie/:serieId/register')
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  async register(
    @Body() input: RegisterTournamentDTO,
    @Param('tournamentId', ParseIntPipe) tournamentId: number,
    @Param('serieId', ParseIntPipe) serieId: number,
    ) {
    return this.tournamentService.registerToTournament(tournamentId, serieId, input);
  }
}
