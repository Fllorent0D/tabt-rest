import { CACHE_MANAGER, CacheStore, Inject, Injectable } from '@nestjs/common';
import {createHash} from 'crypto';
import { DatadogService } from '../logger/datadog.service';

// Durations in Seconds

export enum TTL_DURATION {
  ONE_DAY = 86_400,
  EIGHT_HOURS = 28_800,
  ONE_HOUR = 3_600,
  TWO_HOURS = 7_200,
}

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    private readonly dataDogService: DatadogService
  ) {
  }

  getFromCache<T>(key: string): Promise<T> {
    this.dataDogService.statsD.increment('cache.get')
    return this.cacheManager.get(key) as Promise<T | undefined>;
  }

  setInCache(key: string, value: any, ttl: number): Promise<void> {
    this.dataDogService.statsD.increment('cache.set')
    return this.cacheManager.set(key, value, { ttl }) as Promise<void>;
  }

  getCacheKey(prefix: string, input: any, db: string): string {
    return createHash('md5').update(`${prefix}-${db}-${JSON.stringify(input)}`).digest('hex');
  }

  async getFromCacheOrGetAndCacheResult<T>(key: string, getter: () => Promise<T>, ttl = 600): Promise<T> {
    const cached = await this.getFromCache<T>(key);

    if (cached) {
      this.dataDogService.statsD.increment('cache.found')
      return cached;
    }

    this.dataDogService.statsD.increment('cache.not_found')

    const result = await getter();
    await this.setInCache(key, result, ttl);
    return result;
  }

}
