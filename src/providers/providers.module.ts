import { CacheModule, Module } from '@nestjs/common';
import { createClientAsync } from 'soap';
import { CacheService } from './cache/cache.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganInterceptor, MorganModule } from 'nest-morgan';


const asyncProviders = [
  {
    provide: 'TABT_CLIENT',
    useFactory: async () => {
      return createClientAsync('https://resultats.aftt.be/api/?wsdl', {
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

  ],
  exports: [
    ...asyncProviders,
    CacheService,
  ],
})
export class ProvidersModule {
}
