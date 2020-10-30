import { Injectable, Logger } from '@nestjs/common';
import {
  GetTournamentsInput,
  TournamentEntry,
  TournamentRegisterInput,
  TournamentRegisterOutput,
} from '../../entity/tabt-soap/TabTAPI_Port';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';


@Injectable()
export class TournamentService {

  constructor(
    private tabtClient: TabtClientService,
  ) {
  }

  async getTournaments(input: GetTournamentsInput): Promise<TournamentEntry[]> {
    const [result] = await this.tabtClient.GetTournamentsAsync(input);
    return result.TournamentEntries.map((t) => new TournamentEntry(t));
  }

  async registerToTournament(input: TournamentRegisterInput): Promise<TournamentRegisterOutput> {
    const [result] = await this.tabtClient.TournamentRegisterAsync(input);
    return result;
  }
}
