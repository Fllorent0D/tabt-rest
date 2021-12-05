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
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { DatadogService } from './logger/datadog.service';
import { LoggerModule } from 'nestjs-pino';
import * as pinoms from 'pino-multi-stream';
import * as fs from 'fs';

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
            store: redisStore,
            url: redisUrl,
          };
        } else {
          return null;
        }
      },
    }),
    ConfigModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          pinoHttp: [
            {
              level: config.get('NODE_ENV') === 'dev' ? 'debug' : 'info',
            },
            pinoms.multistream([
              {
                stream: fs.createWriteStream('./tabt-rest-logs.log'),
              },
              {
                stream: pinoms.prettyStream(
                  {
                    prettyPrint: {
                      colorize: true,
                      translateTime: 'SYS:standard',
                      ignore: 'hostname,pid',
                    },
                  },
                )
              }
            ]),
          ],
        };
      },
    }),
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
    DatadogService,
  ],
  exports: [
    ...asyncProviders,
    CacheService,
    ContextService,
    TabtClientService,
    PackageService,
    DatadogService,
  ],
})
export class CommonModule {
}
