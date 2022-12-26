import {
  Body, ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TournamentEntry, TournamentSerieEntry } from '../../../entity/tabt-soap/TabTAPI_Port';
import { TabtException } from '../../../common/filter/tabt-exceptions.filter';
import { TournamentService } from '../../../services/tournaments/tournament.service';
import { GetTournamentDetails, RegisterTournament } from '../dto/tournaments.dto';
import { TabtHeadersDecorator } from '../../../common/decorators/tabt-headers.decorator';

@ApiTags('Tournaments')
@Controller({
  path: 'tournaments',
  version: '1',
})
@TabtHeadersDecorator()
export class TournamentController {
  constructor(
    private readonly tournamentService: TournamentService,
  ) {
  }

  @Get()
  @ApiOperation({
    operationId: 'findAllTournaments',
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
  findAll() {
    return this.tournamentService.getTournaments({});
  }

  @Get()
  @ApiOperation({
    operationId: 'findAllTournamentsV2',
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
  @Version('2')
  @UseInterceptors(ClassSerializerInterceptor)
  findAllV2() {
    return this.tournamentService.getTournaments({});
  }

  @Get(':tournamentId')
  @ApiOperation({
    operationId: 'findTournamentById',
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

  @Get(':tournamentId')
  @ApiOperation({
    operationId: 'findTournamentByIdV2',
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
  @UseInterceptors(ClassSerializerInterceptor)
  @Version('2')
  async findByIdV2(
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
    operationId: 'findSeriesByTournament',
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
    operationId: 'registerToSerie',
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
      Unregister: input.unregister,
    });
  }
}
