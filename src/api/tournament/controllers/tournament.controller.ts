import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTournamentsInput, TournamentEntry, TournamentSerieEntry } from '../../../entity/tabt-soap/TabTAPI_Port';
import { TabtException } from '../../../common/filter/tabt-exceptions.filter';
import { TournamentService } from '../../../services/tournaments/tournament.service';
import { GetTournamentDetails, GetTournaments, RegisterTournament } from '../dto/tournaments.dto';
import { TabtHeadersDecorator } from '../../../common/decorators/tabt-headers.decorator';

@ApiTags('Tournaments')
@Controller('tournaments')
@TabtHeadersDecorator()
export class TournamentController {
  constructor(private tournamentService: TournamentService) {
  }

  @Get()
  @ApiOperation({
    operationId: 'findAll'
  })
  @ApiResponse({
    description: 'A list of tournament.',
    type: [TournamentEntry],
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  findAll(
    @Query() input: GetTournaments,
  ) {
    return this.tournamentService.getTournaments({ Season: input.season } as GetTournamentsInput);
  }

  @Get(':tournamentId')
  @ApiOperation({
    operationId: 'findById'
  })
  @ApiResponse({
    description: 'A specific tournament.',
    type: TournamentEntry,
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  async findById(
    @Query() input: GetTournamentDetails,
    @Param('tournamentId', ParseIntPipe) id: number,
  ) {
    const result = await this.tournamentService.getTournaments({
      WithRegistrations: input.withRegistrations,
      WithResults: input.withResults,
      TournamentUniqueIndex: id,
    });
    if (result.length) {
      return result[0];
    }
    throw new NotFoundException();
  }

  @Get(':tournamentId/series')
  @ApiOperation({
    operationId: 'findSeriesTournament'
  })
  @ApiResponse({
    description: 'A specific tournament.',
    type: [TournamentSerieEntry],
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  async getSeries(
    @Param('tournamentId', ParseIntPipe) id: number,
  ) {
    const result = await this.tournamentService.getTournaments({
      TournamentUniqueIndex: id,
      WithRegistrations: true,
    });
    if (result.length) {
      return result[0].SerieEntries;
    }
    throw new NotFoundException();
  }

  @Post(':tournamentId/serie/:serieId/register')
  @ApiOperation({
    operationId: 'registerToSerieId'
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  async register(
    @Body() input: RegisterTournament,
    @Param('tournamentId', ParseIntPipe) tournamentId: number,
    @Param('serieId', ParseIntPipe) serieId: number,
  ) {
    return this.tournamentService.registerToTournament({
      TournamentUniqueIndex: tournamentId,
      SerieUniqueIndex: serieId,
      PlayerUniqueIndex: input.playerUniqueIndex,
      NotifyPlayer: input.notifyPlayer,
      Unregister: input.unregister
    });
  }
}
