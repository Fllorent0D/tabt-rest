import { CacheModule, Module, Provider } from '@nestjs/common';
import { createClientAsync } from 'soap';
import { CacheService } from './cache/cache.service';
import { ContextService } from './context/context.service';
import { CredentialsService } from './tabt-client/credentials.service';
import { DatabaseContextService } from './context/database-context.service';
import { TabtClientService } from './tabt-client/tabt-client.service';
import { TabtClientSwitchingService } from './tabt-client/tabt-client-switching.service';
import { PackageService } from './package/package.service';
import { HeaderKeys, TABT_HEADERS } from './context/context.constants';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
import { cloneDeep } from 'lodash';

const asyncProviders: Provider[] = [
  {
    provide: 'tabt-aftt',
    useFactory: async () => {
      return createClientAsync(process.env.AFTT_WSDL, {
        returnFault: false,
      });
    },
  },
  {
    provide: 'tabt-vttl',
    useFactory: async () => {
      return createClientAsync(process.env.VTLL_WSDL, {
        returnFault: false,
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
            store: redisStore,
            url: redisUrl,
          };
        } else {
          return null;
        }
      },
    }),
    ConfigModule,
    LoggerModule.forRoot({
        pinoHttp: {
            level: 'debug',
            transport: { target: 'pino-pretty' },
            serializers: {
              req: pino.stdSerializers.wrapRequestSerializer(r => {
                const clonedReq = cloneDeep(r);
                delete clonedReq.headers[HeaderKeys.X_TABT_PASSWORD.toLowerCase()];
                return clonedReq;
              }),
            },
          },
      },
    ),
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
  ],
  exports: [
    ...asyncProviders,
    CacheService,
    ContextService,
    TabtClientService,
    PackageService,
  ],
})
export class CommonModule {
}
