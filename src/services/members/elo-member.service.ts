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
      return this.getELOsFromAFTT(playerUniqueIndex, season);
    };

    return this.cacheService.getFromCacheOrGetAndCacheResult(`elo-wk-${playerId}-${season}`, getter, TTL_DURATION.EIGHT_HOURS);
  }


  private async getELOsFromAFTT(uniquePlayerId: number, season: number): Promise<WeeklyELO[]> {
    const page = await this.httpService.get<string>(`https://resultats.aftt.be/?menu=6&season=${season}&result=1&sel=${uniquePlayerId}&category=1&show_elo_in_table=1`, {
      responseType: 'text',
    }).toPromise();
    const domParser = new DOMParser({ errorHandler: () => void (0) });
    const dom = domParser.parseFromString(page.data, 'text/html');
    const matchListDiv = dom.getElementById('match_list');
    const table = matchListDiv.getElementsByTagName('table').item(0);
    // #match_list > table > tbody > tr:nth-child(2)
    if (table) {
      const elos: Map<string, number> = new Map<string, number>();
      const matchesRows = table.childNodes;
      for (let row = 3; row < matchesRows.length; row = row + 2) {
        const currentRow = matchesRows.item(row);

        const week = currentRow.childNodes[1].childNodes[0].data;
        const elo = Number((currentRow.childNodes[21].childNodes[0].nodeValue as string).replace('&nbsp;', ''));

        if (elo) {
          elos.set(week, elo);
        }
      }
      const arr = [];
      for (const [key, value] of elos) {
        arr.push({ weekName: key, elo: value });
      }
      return arr;
    }
    return [];
  }
}
