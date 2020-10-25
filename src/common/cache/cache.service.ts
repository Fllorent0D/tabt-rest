import { CACHE_MANAGER, CacheStore, Inject, Injectable, Logger } from '@nestjs/common';

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
