import { CacheModule, Module, Provider } from '@nestjs/common';
import { createClientAsync } from 'soap';
import { CacheService } from './cache/cache.service';
import { ContextService } from './context/context.service';
import { CredentialsService } from './tabt-client/credentials.service';
import { DatabaseContextService } from './context/database-context.service';
import { TabtClientService } from './tabt-client/tabt-client.service';
import { TabtClientSwitchingService } from './tabt-client/tabt-client-switching.service';
import { PackageService } from './package/package.service';
import { TABT_HEADERS } from './context/context.constants';
import { LogtailLogger } from './logger/logger.class';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
const asyncProviders: Provider[] = [
  {
    provide: 'tabt-aftt',
    useFactory: async () => {
      return createClientAsync(process.env.AFTT_WSDL, {
        returnFault: true,
      });
    },
  },
  {
    provide: 'tabt-vttl',
    useFactory: async () => {
      return createClientAsync(process.env.VTLL_WSDL, {
        returnFault: true,
      });
    },
  },
  {
    provide: 'TABT_HEADERS',
    useValue: TABT_HEADERS,
  },
];

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        const redisUrl = process.env.REDIS_TLS_URL;
        if (redisUrl) {
          return {
            url: redisUrl
          }
        } else {
          return null;
        }
      },
    }),
    ConfigModule,
  ],
  providers: [
    ...asyncProviders,
    CacheService,
    ContextService,
    CredentialsService,
    DatabaseContextService,
    TabtClientService,
    TabtClientSwitchingService,
    PackageService,
    LogtailLogger,
  ],
  exports: [
    ...asyncProviders,
    CacheService,
    ContextService,
    TabtClientService,
    PackageService,
    LogtailLogger,
  ],
})
export class CommonModule {
}
