import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  GetTournamentsInput,
  TournamentEntry,
  TabTAPISoap, TournamentRegisterOutput,
} from '../../entity/tabt/TabTAPI_Port';
import { CacheService } from '../../providers/cache/cache.service';
import { RegisterTournamentDTO } from '../dto/tournaments.dto';

export const CACHE_KEY = 'TOURNAMENTS';

@Injectable()
export class TournamentService {
  private readonly logger = new Logger('TournamentService', true);

  constructor(
    @Inject('TABT_CLIENT') private tabtClient: TabTAPISoap,
    private cacheService: CacheService,
  ) {
  }

  async getTournaments(input: GetTournamentsInput): Promise<TournamentEntry[]> {
    const getter = async () => {
      const [result] = await this.tabtClient.GetTournamentsAsync(input);
      this.logger.debug('Fetched seasons from TabT');
      return result.TournamentEntries;
    };
    return this.cacheService.getAndSetInCache(CACHE_KEY, input, getter, 3600);
  }

  async registerToTournament(tournamentId: number, serieId: number, input: RegisterTournamentDTO): Promise<TournamentRegisterOutput[]> {
    return this.tabtClient.TournamentRegisterAsync({...input, TournamentUniqueIndex: tournamentId, SerieUniqueIndex: serieId });
  }
}
