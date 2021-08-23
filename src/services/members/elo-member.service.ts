import { HttpService, Injectable, Logger } from '@nestjs/common';
import { InternalIdMapperService } from '../id-mapper/internal-id-mapper.service';
import { DOMParser } from 'xmldom';
import { WeeklyELO } from '../../api/member/dto/member.dto';
import { CacheService, TTL_DURATION } from '../../common/cache/cache.service';

@Injectable()
export class EloMemberService {
  private readonly logger = new Logger('EloMemberService', true);

  constructor(
    private readonly httpService: HttpService,
    private readonly internalIdService: InternalIdMapperService,
    private readonly cacheService: CacheService,
  ) {
  }


  public async getEloWeekly(playerId: number, season: number): Promise<WeeklyELO[]> {
    const getter = async () => {
      const playerUniqueIndex = await this.internalIdService.getInternalPlayerId(playerId);
      const elos: number[] = await this.getELOsFromAFTT(playerUniqueIndex, season);

      return elos.map((elo, index) => ({ weekName: index + 1, elo }));
    };

    return this.cacheService.getFromCacheOrGetAndCacheResult(`elo-wk-${playerId}-${season}`, getter, TTL_DURATION.EIGHT_HOURS);
  }


  private async getELOsFromAFTT(uniquePlayerId: number, season: number): Promise<number[]> {
    const page = await this.httpService.get<string>(`https://resultats.aftt.be/?menu=6&season=${season}&result=1&sel=${uniquePlayerId}&category=1&show_elo_in_table=1`, {
      responseType: 'text',
    }).toPromise();
    const domParser = new DOMParser({ errorHandler: () => void (0) });
    const dom = domParser.parseFromString(page.data, 'text/html');
    const table = dom.getElementsByTagName('table');

    if (table[12]) {
      const elos: number[] = [];
      const matchesTable = table[12];
      const matchesRows = matchesTable.childNodes;
      for (let row = 3; row < matchesRows.length; row = row + 2) {
        const currentRow = matchesRows[row];

        const week = Number((currentRow.childNodes[5].childNodes[0].childNodes[0].nodeValue as string).split('/')[0]);
        const elo = Number((currentRow.childNodes[19].childNodes[0].nodeValue as string).replace('&nbsp;', ''));

        if (!elos[week - 1]) {
          elos[week - 1] = elo;
        }
      }

      const findNext = (i: number): number => {
        if (elos[i + 1]) {
          return elos[i + 1];
        } else {
          return findNext(i + 1);
        }
      };
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < elos.length; i++) {
        if (!elos[i]) {
          elos[i] = findNext(i);
        }
      }
      return elos;
    }
    return [];
  }
}
