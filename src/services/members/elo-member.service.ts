import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InternalIdMapperService } from '../id-mapper/internal-id-mapper.service';
import {
  COMPETITION_TYPE,
  NumericRankingDetailsV3,
  NumericRankingPerWeekOpponentsV3,
  WeeklyNumericRanking,
  WeeklyNumericRankingV2,
  WeeklyNumericRankingV3,
} from '../../api/member/dto/member.dto';
import { CacheService, TTL_DURATION } from '../../common/cache/cache.service';
import { firstValueFrom } from 'rxjs';
import { PlayerCategory } from '../../entity/tabt-input.interface';
import { SocksProxyHttpClient } from '../../common/socks-proxy/socks-proxy-http-client';
import { ConfigService } from '@nestjs/config';
import { UserAgentsUtil } from '../../common/utils/user-agents.util';
import { JSDOM } from 'jsdom';
import { SimplifiedPlayerCategory } from '../../api/member/helpers/player-category-helpers';
import { format } from 'date-fns';
import { DataAfftTokenRefresherService } from './data-afft-token-refresher.service';

@Injectable()
export class EloMemberService {
  private readonly logger = new Logger('EloMemberService');

  constructor(
    private readonly httpService: HttpService,
    private readonly internalIdService: InternalIdMapperService,
    private readonly cacheService: CacheService,
    private readonly socksProxyService: SocksProxyHttpClient,
    private readonly configService: ConfigService,
    private readonly dataAFTTTokenRefresherService: DataAfftTokenRefresherService,
  ) {
  }

  public async getBelNumericRanking(playerId: number, season: number, category: SimplifiedPlayerCategory = PlayerCategory.MEN): Promise<WeeklyNumericRanking[]> {
    const points = await this.getBelNumericRankingV2(playerId, category);
    return points.map((point) => ({
      ...point,
      elo: 0,
    }));
  }

  public async getBelNumericRankingV2(playerId: number, category: PlayerCategory.MEN | PlayerCategory.WOMEN = PlayerCategory.MEN): Promise<WeeklyNumericRankingV2[]> {
    const getter = () => this.getELOsAndNumeric(playerId, category);
    return this.cacheService.getFromCacheOrGetAndCacheResult(`elo-bel-wk:${PlayerCategory[category]}-${playerId}`, getter, TTL_DURATION.TWO_DAYS);
  }

  private async getAFTTDataPage(uniquePlayerId: number, category: PlayerCategory.MEN | PlayerCategory.WOMEN): Promise<Document> {
    const getter = async () => {
      const url = `https://data.aftt.be/cltnum-${category === PlayerCategory.WOMEN ? 'dames' : 'messieurs'}/fiche.php`;
      const urlSearchParams = new URLSearchParams();
      // 😇
      //const token = await this.dataAFTTTokenRefresherService.getToken();
      urlSearchParams.append('licence', uniquePlayerId.toString(10));
      const userAgent = UserAgentsUtil.random;
      const httpsAgent = this.configService.get('USE_SOCKS_PROXY') === 'true' ? await this.socksProxyService.createHttpsAgent() : undefined;
      const response = await firstValueFrom(this.httpService.post<string>(
        url,
        urlSearchParams,
        {
          responseType: 'text',
          headers: {
            'User-Agent': userAgent,
          },
          httpsAgent,
        }));
      return response.data;
    };
    const pageString = await this.cacheService.getFromCacheOrGetAndCacheResult(`aftt-data-page-${uniquePlayerId}-${category}`, getter, TTL_DURATION.TWELVE_HOURS);
    return new JSDOM(pageString).window.document;

  }

  private async getELOsAndNumeric(uniquePlayerId: number, category: PlayerCategory.MEN | PlayerCategory.WOMEN): Promise<WeeklyNumericRankingV2[]> {
    const domPage: Document = await this.getAFTTDataPage(uniquePlayerId, category);
    return this.parseCanvasForPoints(domPage);
  }

  private parseCanvasForPoints(domPage: Document): WeeklyNumericRankingV2[] {
    const canvasElement: HTMLCanvasElement = domPage.querySelector('body > div.content > div.row > div:nth-child(2) > canvas') as HTMLCanvasElement;
    // #match_list > table > tbody > tr:nth-child(2)
    if (canvasElement) {
      const dates = JSON.parse(canvasElement.getAttribute('data-mdb-labels').replace(/'/g, '"'));
      const bels = JSON.parse(canvasElement.getAttribute('data-mdb-dataset-data').replace(/'/g, '"')).map(Number);
      return dates.map((date, i) => ({
        weekName: date,
        bel: bels[i],
      }));

    }
    return [];
  }

  private parseTableForHistory(tableHtml: HTMLTableElement): NumericRankingDetailsV3[] {
    const results = [];

    const tBodies: HTMLCollectionOf<HTMLTableSectionElement> = tableHtml.tBodies;
    // body > div.content > div.table-responsive > table
    if (tBodies.length) {
      const firstTBody = tBodies.item(0);
      let dateHistoryItem: NumericRankingDetailsV3;
      for (const line of firstTBody.rows) {
        if (!['TabWin', 'TabLoose'].includes(line.className)) {
          if (dateHistoryItem) {
            results.push(dateHistoryItem);
          }
          // parse weekname line
          const cellContent = line.cells[0].textContent.trim();
          const [context, pointsSummary] = cellContent.split(' | ');
          const [date, competition, ...club] = context.split(' - ');
          const [day, month, year] = date.split('/').map(Number);
          const [basePoints, endPoints] = this.parseBaseAndEndPoints(pointsSummary);
          dateHistoryItem = {
            date: format(new Date(year, month - 1, day), 'yyyy-MM-dd'),
            basePoints,
            endPoints,
            competitionType: club.length ? COMPETITION_TYPE.CHAMPIONSHIP : COMPETITION_TYPE.TOURNAMENT,
            competitionContext: competition,
            opponents: [],
          };
        } else {
          // parse result
          if (!dateHistoryItem) {
            continue;
          }
          const opponent: NumericRankingPerWeekOpponentsV3 = {
            opponentName: line.cells[1].textContent,
            score: line.cells[2].textContent,
            opponentRanking: line.cells[3].textContent,
            opponentNumericRanking: Number(line.cells[4].textContent),
            pointsWon: Number(line.cells[5].textContent.slice(0, -3)),
          };
          dateHistoryItem.opponents.push(opponent);
        }
      }
      if (dateHistoryItem) {
        results.push(dateHistoryItem);
      }
    }
    return results.reverse();
  }

  async getBelNumericRankingV3(playerUniqueIndex: number, category: SimplifiedPlayerCategory): Promise<WeeklyNumericRankingV3> {
    const weeklyNumericRankingV3: WeeklyNumericRankingV3 = {
      points: [],
      perDateHistory: [],
    };
    const domPage = await this.getAFTTDataPage(playerUniqueIndex, category);
    const table = this.findHistoryTable(domPage, category);
    weeklyNumericRankingV3.perDateHistory = this.parseTableForHistory(table);
    weeklyNumericRankingV3.points = this.parseCanvasForPoints(domPage).map((item) => ({
      weekName: item.weekName,
      points: item.bel,
    }));

    return weeklyNumericRankingV3;
  }

  private parseBaseAndEndPoints(pointsStr: string): number[] {
    const regex = /[a-z\s]+\s:\s([0-9.]+)/gm;
    const results: number[] = [];
    let m;
    while ((m = regex.exec(pointsStr)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      results.push(Number(m[1]));
    }
    return results;
  }

  private findHistoryTable(domPage: Document, category: SimplifiedPlayerCategory): HTMLTableElement {
    return (category === PlayerCategory.MEN) ?
      domPage.querySelector('body > div.content > div.table-responsive > div.table-responsive > table') as HTMLTableElement :
      domPage.querySelector('body > div.content > div:nth-child(3) > table') as HTMLTableElement;
  }
}
