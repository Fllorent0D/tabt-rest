export class CacheService {

  getFromCache<T>(key: string): Promise<T> {
    return Promise.resolve({} as T);
  }

  setInCache(key: string, value: any, ttl: number): Promise<void> {
    return Promise.resolve();
  }

  getCacheKey(prefix: string, input: any, db: string): string {
    return `${prefix}-${db}-${JSON.stringify(input)}`;
  }

  async getFromCacheOrGetAndCacheResult<T>(key: string, getter: () => Promise<T>, ttl = 600): Promise<T> {
    return Promise.resolve({} as T);
  }

}
