import { CACHE_MANAGER, CacheStore, Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CacheService {
  private readonly logger = new Logger('CacheService', true);

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

}
