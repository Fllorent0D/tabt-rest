import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import {
  AsyncConfiguration,
  Configuration,
  ConfigurationFactory,
} from './configuration';

import { ClubsService } from './api/clubs.service';
import { DashboardsService } from './api/dashboards.service';
import { DefaultService } from './api/default.service';
import { DivisionsService } from './api/divisions.service';
import { Head2HeadService } from './api/head2Head.service';
import { HealthService } from './api/health.service';
import { InternalIdentifiersService } from './api/internalIdentifiers.service';
import { MatchesService } from './api/matches.service';
import { MembersService } from './api/members.service';
import { SeasonsService } from './api/seasons.service';
import { TournamentsService } from './api/tournaments.service';

@Global()
@Module({
  imports: [HttpModule],
  exports: [
    ClubsService,
    DashboardsService,
    DefaultService,
    DivisionsService,
    Head2HeadService,
    HealthService,
    InternalIdentifiersService,
    MatchesService,
    MembersService,
    SeasonsService,
    TournamentsService,
  ],
  providers: [
    ClubsService,
    DashboardsService,
    DefaultService,
    DivisionsService,
    Head2HeadService,
    HealthService,
    InternalIdentifiersService,
    MatchesService,
    MembersService,
    SeasonsService,
    TournamentsService,
  ],
})
export class ApiModule {
  public static forRoot(
    configurationFactory: () => Configuration,
  ): DynamicModule {
    return {
      module: ApiModule,
      providers: [{ provide: Configuration, useFactory: configurationFactory }],
    };
  }

  /**
   * Register the module asynchronously.
   */
  static forRootAsync(options: AsyncConfiguration): DynamicModule {
    const providers = [...this.createAsyncProviders(options)];
    return {
      module: ApiModule,
      imports: options.imports || [],
      providers,
      exports: providers,
    };
  }

  private static createAsyncProviders(options: AsyncConfiguration): Provider[] {
    if (options.useClass) {
      return [
        this.createAsyncConfigurationProvider(options),
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
      ];
    }
    return [this.createAsyncConfigurationProvider(options)];
  }

  private static createAsyncConfigurationProvider(
    options: AsyncConfiguration,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: Configuration,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: Configuration,
      useFactory: async (optionsFactory: ConfigurationFactory) =>
        await optionsFactory.createConfiguration(),
      inject:
        (options.useExisting && [options.useExisting]) ||
        (options.useClass && [options.useClass]) ||
        [],
    };
  }

  constructor(httpService: HttpService) {}
}
