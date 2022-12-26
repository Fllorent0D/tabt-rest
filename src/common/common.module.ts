import { CacheModule, CacheStore, Logger, Module, Provider } from '@nestjs/common';
import { CacheService } from './cache/cache.service';
import { ContextService } from './context/context.service';
import { CredentialsService } from './tabt-client/credentials.service';
import { DatabaseContextService } from './context/database-context.service';
import { TabtClientService } from './tabt-client/tabt-client.service';
import { TabtClientSwitchingService } from './tabt-client/tabt-client-switching.service';
import { PackageService } from './package/package.service';
import { HeaderKeys, TABT_HEADERS } from './context/context.constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {redisStore} from 'cache-manager-redis-store';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
import { cloneDeep } from 'lodash';
import { SocksProxyHttpClient } from './socks-proxy/socks-proxy-http-client';
import { createSoapClient } from './tabt-client/soap-client.factory';
import { memoryStore } from 'cache-manager';
import { CacheModuleOptsFactory } from './cache/cache-module-opts.factory';


const asyncProviders: Provider[] = [
  {
    provide: 'tabt-aftt',
    useFactory: async (configService, socksProxy) => {
      return createSoapClient(process.env.AFTT_WSDL);
    },
    inject: [ConfigService, SocksProxyHttpClient],
  },
  {
    provide: 'tabt-vttl',
    useFactory: async (configService, socksProxy) => {
      return createSoapClient(process.env.VTLL_WSDL);
    },
    inject: [ConfigService, SocksProxyHttpClient],
  },
  {
    provide: 'TABT_HEADERS',
    useValue: TABT_HEADERS,
  },
];

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheModuleOptsFactory,
      imports: [ConfigModule],
    }),
    ConfigModule,
    LoggerModule.forRoot({
        pinoHttp: {
          level: 'debug',
          transport: { target: 'pino-pretty' },
          quietReqLogger: true,
          serializers: {
            req: pino.stdSerializers.wrapRequestSerializer(r => {
              const clonedReq = cloneDeep(r);
              delete clonedReq.headers[HeaderKeys.X_TABT_PASSWORD.toLowerCase()];
              return clonedReq;
            }),
            err: pino.stdSerializers.err,
            res: pino.stdSerializers.res,
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
    SocksProxyHttpClient,
  ],
  exports: [
    ...asyncProviders,
    CacheService,
    ContextService,
    TabtClientService,
    PackageService,
    SocksProxyHttpClient,
    ConfigModule,
  ],
})
export class CommonModule {
}
