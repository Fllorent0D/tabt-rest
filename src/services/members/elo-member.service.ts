import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InternalIdMapperService } from '../id-mapper/internal-id-mapper.service';
import { WeeklyNumericRanking, WeeklyNumericRankingV2 } from '../../api/member/dto/member.dto';
import { CacheService, TTL_DURATION } from '../../common/cache/cache.service';
import { firstValueFrom } from 'rxjs';
import { PlayerCategory } from '../../entity/tabt-input.interface';
import { SocksProxyHttpClient } from '../../common/socks-proxy/socks-proxy-http-client';
import { ConfigService } from '@nestjs/config';
import { UserAgentsUtil } from '../../common/utils/user-agents.util';
import { JSDOM } from 'jsdom';

@Injectable()
export class EloMemberService {
  private readonly logger = new Logger('EloMemberService');

  constructor(
    private readonly httpService: HttpService,
    private readonly internalIdService: InternalIdMapperService,
    private readonly cacheService: CacheService,
    private readonly socksProxyService: SocksProxyHttpClient,
    private readonly configService: ConfigService,
  ) {
  }

  public async getBelNumericRanking(playerId: number, season: number, category: PlayerCategory = PlayerCategory.MEN): Promise<WeeklyNumericRanking[]> {
    const points = await this.getBelNumericRankingV2(playerId, category);
    return points.map((point) => ({
      ...point,
      elo: 0,
    }));
  }

  public async getBelNumericRankingV2(playerId: number, category: PlayerCategory = PlayerCategory.MEN): Promise<WeeklyNumericRankingV2[]> {
    let simplifiedCategory: PlayerCategory.MEN | PlayerCategory.WOMEN;
    switch (category) {
      case PlayerCategory.MEN:
      case PlayerCategory.MEN_POST_23:
      case PlayerCategory.YOUTH:
      case PlayerCategory.VETERANS:
      default:
        simplifiedCategory = PlayerCategory.MEN;
        break;
      case PlayerCategory.WOMEN:
      case PlayerCategory.WOMEN_POST_23:
      case PlayerCategory.VETERANS_WOMEN:
      case PlayerCategory.YOUTH_POST_23:
        simplifiedCategory = PlayerCategory.WOMEN;
        break;
    }

    const getter = async () => {
      return this.getELOsAndNumeric(playerId, simplifiedCategory);
    };

    return this.cacheService.getFromCacheOrGetAndCacheResult(`elo-bel-wk:${PlayerCategory[simplifiedCategory]}-${playerId}`, getter, TTL_DURATION.TWO_DAYS);
  }

  private async getCanvasElement(uniquePlayerId: number, category: PlayerCategory.MEN | PlayerCategory.WOMEN): Promise<HTMLCanvasElement> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('licence', uniquePlayerId.toString(10));
    const page = await firstValueFrom(this.httpService.post<string>(`https://data.aftt.be/cltnum-${category === PlayerCategory.WOMEN ? 'dames' : 'messieurs'}/fiche.php`, urlSearchParams, {
      responseType: 'text',
      headers: {
        'User-Agent': UserAgentsUtil.random,
      },
      httpsAgent: this.configService.get('USE_SOCKS_PROXY') === 'true' ? this.socksProxyService.createHttpsAgent() : undefined,
    }));
    const dom = new JSDOM(page.data, {});
    return dom.window.document.querySelector('body > div.content > div.row > div:nth-child(2) > canvas') as HTMLCanvasElement;
  }

  private async getELOsAndNumeric(uniquePlayerId: number, category: PlayerCategory.MEN | PlayerCategory.WOMEN): Promise<WeeklyNumericRankingV2[]> {
    const canvasElement: HTMLCanvasElement = await this.getCanvasElement(uniquePlayerId, category);

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
}
