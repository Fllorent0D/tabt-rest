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
    useValue: TABT_HEADERS
  }
];

@Module({
  imports: [
    CacheModule.register(),
  ],
  providers: [
    ...asyncProviders,
    CacheService,
    ContextService,
    CredentialsService,
    DatabaseContextService,
    TabtClientService,
    TabtClientSwitchingService,
    PackageService
  ],
  exports: [
    ...asyncProviders,
    CacheService,
    ContextService,
    TabtClientService,
    PackageService
  ],
})
export class CommonModule {
}
