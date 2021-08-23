import { CACHE_MANAGER, CacheStore, Inject, Injectable } from '@nestjs/common';

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
  ) {
  }

  getFromCache<T>(key: string): Promise<T> {
    return this.cacheManager.get(key) as Promise<T | undefined>;
  }

  setInCache(key: string, value: any, ttl: number): Promise<void> {
    return this.cacheManager.set(key, value, { ttl }) as Promise<void>;
  }

  getCacheKey(prefix: string, input: any, db: string): string {
    return `${prefix}-${db}-${JSON.stringify(input)}`;
  }

  async getFromCacheOrGetAndCacheResult<T>(key: string, getter: () => Promise<T>, ttl = 600): Promise<T> {
    const cached = await this.getFromCache<T>(key);

    if (cached) {
      return cached;
    }

    const result = await getter();
    await this.setInCache(key, result, ttl);
    return result;
  }

}
