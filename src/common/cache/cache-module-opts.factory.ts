import { CacheModuleOptions, CacheOptionsFactory, CacheStore, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { memoryStore } from "cache-manager";
import { redisStore } from "cache-manager-redis-store";
@Injectable()
export class CacheModuleOptsFactory implements CacheOptionsFactory {

    constructor(
        private readonly configService: ConfigService
    ) {
    }

    async createCacheOptions(): Promise<CacheModuleOptions<Record<string, any>>> {
        if (this.configService.get('REDIS_TLS_URL')) {
            return {
                store: (await redisStore({
                    url: this.configService.get('REDIS_TLS_URL'),
                })) as unknown as CacheStore
            };
        } else {
            return {
                store: memoryStore()
            }
        }
    }
}