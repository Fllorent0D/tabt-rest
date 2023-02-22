import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { SocksProxyHttpClient } from '../../common/socks-proxy/socks-proxy-http-client';
import { UserAgentsUtil } from '../../common/utils/user-agents.util';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CacheService } from '../../common/cache/cache.service';

@Injectable()
export class DataAfftTokenRefresherService {

  private readonly logger = new Logger('DataAfftTokenRefresherService');

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly socksProxyService: SocksProxyHttpClient,
    private readonly cacheService: CacheService,
  ) {

  }

  async fetchToken(): Promise<string> {
    const url = 'https://data.aftt.be/cltnum-messieurs/club.php';
    const userAgent = UserAgentsUtil.random;
    const httpsAgent = this.configService.get('USE_SOCKS_PROXY') === 'true' ? await this.socksProxyService.createHttpsAgent() : undefined;
    const response = await firstValueFrom(this.httpService.get<string>(
      url,
      {
        responseType: 'text',
        headers: {
          'User-Agent': userAgent,
        },
        httpsAgent,
      }));
    const html = response.data;
    const regex = new RegExp('[0-9A-F]{100}', 'gmi');
    const match = regex.exec(html);
    return match[0];
  }


  async refreshToken(): Promise<void> {
    this.logger.log('Refreshing data.aftt.be token...');
    const token = await this.fetchToken();
    await this.saveToken(token);
    console.log(token)
    this.logger.log('data.aftt.be token refreshed.');
  }

  async checkTokenExistance(): Promise<void> {
    const token = await this.getToken();
    if (!token) {
      this.logger.log('No token found, refreshing it...');
      await this.refreshToken();
    }
  }

  async getToken(): Promise<string> {
    return await this.cacheService.getFromCache('data-afft-token');
  }

  private async saveToken(token: string): Promise<void> {
    await this.cacheService.setInCache('data-afft-token', token);
  }

}
