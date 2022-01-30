import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InternalIdMapperService } from '../id-mapper/internal-id-mapper.service';
import { DOMParser } from 'xmldom';
import { WeeklyELO, WeeklyNumericRanking } from '../../api/member/dto/member.dto';
import { CacheService, TTL_DURATION } from '../../common/cache/cache.service';
import { firstValueFrom } from 'rxjs';
import { PlayerCategory } from '../../entity/tabt-input.interface';

@Injectable()
export class EloMemberService {
  private readonly logger = new Logger('EloMemberService');

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

    return this.cacheService.getFromCacheOrGetAndCacheResult(`elo-wk:${season}:${playerId}`, getter, TTL_DURATION.EIGHT_HOURS);
  }

  public async getBelNumericRanking(playerId: number, season: number, category: PlayerCategory = PlayerCategory.MEN): Promise<WeeklyNumericRanking[]> {
    const getter = async () => {
      try {
        const playerUniqueIndex = await this.internalIdService.getInternalPlayerId(playerId);
        return this.getELOsAndNumeric(playerUniqueIndex, season, category);
      } catch (e) {
        console.log(e.message.indexOf('Player Id not found'))
        if (e.message.indexOf('Player Id not found') > -1) {
          throw new NotFoundException('Player not found');
        }
        throw e;
      }
    };

    return this.cacheService.getFromCacheOrGetAndCacheResult(`elo-bel-wk:${season}:${PlayerCategory[category]}-${playerId}`, getter, TTL_DURATION.EIGHT_HOURS);
  }


  private async getRankingTablePage(uniquePlayerId: number, season: number, category: PlayerCategory): Promise<HTMLElementTagNameMap['table']> {
    const page = await firstValueFrom(this.httpService.get<string>(`https://resultats.aftt.be/?menu=6&season=${season}&result=1&sel=${uniquePlayerId}&category=${PlayerCategory[category]}&show_elo_in_table=1`, {
      responseType: 'text',
    }));
    const domParser = new DOMParser({ errorHandler: () => void (0) });
    const dom = domParser.parseFromString(page.data, 'text/html');
    const matchListDiv = dom.getElementById('match_list');
    return matchListDiv.getElementsByTagName('table').item(0);
  }

  private async getELOsFromAFTT(uniquePlayerId: number, season: number): Promise<WeeklyELO[]> {
    const table = await this.getRankingTablePage(uniquePlayerId, season, PlayerCategory.MEN);

    // #match_list > table > tbody > tr:nth-child(2)
    if (table) {
      const elos: Map<string, number> = new Map<string, number>();
      const matchesRows = table.childNodes;
      for (let row = 3; row < matchesRows.length; row = row + 2) {
        const currentRow = matchesRows.item(row);

        const week = currentRow.childNodes[1].childNodes[0]['data'];
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

  private async getELOsAndNumeric(uniquePlayerId: number, season: number, category: PlayerCategory): Promise<WeeklyNumericRanking[]> {
    const table = await this.getRankingTablePage(uniquePlayerId, season, category);

    // #match_list > table > tbody > tr:nth-child(2)
    if (table) {
      const elos: Map<string, { elo: number, bel: number }> = new Map<string, { elo: number, bel: number }>();
      const matchesRows = table.childNodes;
      for (let row = 3; row < matchesRows.length; row = row + 2) {
        const currentRow = matchesRows.item(row);

        const week = currentRow.childNodes[1].childNodes[0]['data'];
        const elo = Number((currentRow.childNodes[21].childNodes[0].nodeValue as string).replace('&nbsp;', ''));
        const bel = Number((currentRow.childNodes[23].childNodes[0].nodeValue as string).replace('&nbsp;', ''));

        if (elo && bel) {
          elos.set(week, { elo, bel });
        }
      }
      const arr = [];
      for (const [key, { elo, bel }] of elos) {
        arr.push({ weekName: key, elo, bel });
      }
      return arr;
    }
    return [];
  }

  private async getELOsAndNumericV2(uniquePlayerId: number, season: number, category: PlayerCategory): Promise<WeeklyNumericRanking[]> {
    const table = await this.getRankingTablePage(uniquePlayerId, season, category);

    // #match_list > table > tbody > tr:nth-child(2)
    if (table) {
      const elos: Map<string, { elo: number, bel: number }> = new Map<string, { elo: number, bel: number }>();
      const matchesRows = table.childNodes;
      for (let row = 3; row < matchesRows.length; row = row + 2) {
        const currentRow = matchesRows.item(row);

        const week = currentRow.childNodes[1].childNodes[0]['data'];
        const elo = Number((currentRow.childNodes[21].childNodes[0].nodeValue as string).replace('&nbsp;', ''));
        const bel = Number((currentRow.childNodes[23].childNodes[0].nodeValue as string).replace('&nbsp;', ''));

        if (elo && bel) {
          elos.set(week, { elo, bel });
        }
      }
      const arr = [];
      for (const [key, { elo, bel }] of elos) {
        arr.push({ weekName: key, elo, bel });
      }
      return arr;
    }
    return [];
  }
}
