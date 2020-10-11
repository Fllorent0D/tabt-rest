import { CacheModule, Module } from '@nestjs/common';
import { createClientAsync } from 'soap';
import { CacheService } from './cache/cache.service';
import { ContextService } from './context/context.service';
import { CredentialsService } from './tabt-client/credentials.service';
import { DatabaseContextService } from './context/database-context.service';
import { TabtClientService } from './tabt-client/tabt-client.service';
import { TabtClientSwitchingService } from './tabt-client/tabt-client-switching.service';
import { PackageService } from './package/package.service';

const asyncProviders = [
  {
    provide: 'tabt-aftt',
    useFactory: async () => {
      return createClientAsync('https://resultats.aftt.be/api/?wsdl', {
        returnFault: true,
      });
    },
  },
  {
    provide: 'tabt-vttl',
    useFactory: async () => {
      return createClientAsync('https://api.vttl.be/?wsdl', {
        returnFault: true,
      });
    },
  },
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
