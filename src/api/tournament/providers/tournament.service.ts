import { Injectable, Logger } from '@nestjs/common';
import {
  GetTournamentsInput,
  TournamentEntry,
  TournamentRegisterInput,
  TournamentRegisterOutput,
} from '../../../entity/tabt/TabTAPI_Port';
import { TabtClientService } from '../../../common/tabt-client/tabt-client.service';

export const CACHE_KEY = 'TOURNAMENTS';

@Injectable()
export class TournamentService {
  private readonly logger = new Logger('TournamentService', true);

  constructor(
    private tabtClient: TabtClientService,
  ) {
  }

  async getTournaments(input: GetTournamentsInput): Promise<TournamentEntry[]> {
    const [result] = await this.tabtClient.GetTournamentsAsync(input);
    return result.TournamentEntries;
  }

  async registerToTournament(tournamentId: number, serieId: number, input: TournamentRegisterInput): Promise<TournamentRegisterOutput[]> {
    return this.tabtClient.TournamentRegisterAsync({
      ...input,
      TournamentUniqueIndex: tournamentId,
      SerieUniqueIndex: serieId,
    });
  }
}
