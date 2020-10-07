import { CACHE_MANAGER, CacheStore, Inject, Injectable, Logger } from '@nestjs/common';
import { ClubEntry } from '../../entity/tabt/TabTAPI_Port';

@Injectable()
export class CacheService {
  private readonly logger = new Logger('CacheService', true);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
  ) {
  }

  getFromCache<T>(prefix: string, input: any): Promise<T> {
    return this.cacheManager.get(prefix + JSON.stringify(input)) as Promise<T | undefined>;
  }

  setInCache(prefix: string, input: any, value: any, ttl: number): Promise<void> {
    return this.cacheManager.set(prefix + JSON.stringify(input), value, { ttl }) as Promise<void>;
  }

  async getAndSetInCache<T>(prefix: string, input: any, getter: () => Promise<T>, ttl: number): Promise<T> {
    const cached = await this.getFromCache<T>(prefix, input);
    if (cached) {
      this.logger.debug('Value found in cache');
      return cached;
    }
    const value = await getter();
    await this.setInCache(prefix, input, value, ttl);
    return value;
  }

}
