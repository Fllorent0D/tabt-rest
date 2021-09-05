import { Injectable } from '@nestjs/common';
import {
  GetClubsInput,
  GetClubsOutput,
  GetClubTeamsInput,
  GetClubTeamsOutput,
  GetDivisionRankingInput,
  GetDivisionRankingOutput,
  GetDivisionsInput,
  GetMatchesInput,
  GetMatchesOutput,
  GetMatchSystemsInput,
  GetMatchSystemsOutput,
  GetMembersInput,
  GetSeasonsInput,
  GetTournamentsInput,
  IGetDivisionsOutput,
  IGetMembersOutput,
  IGetSeasonsOutput,
  IGetTournamentsOutput,
  ITestInput,
  IUploadInput,
  IUploadOutput,
  TestOutput,
  TournamentRegisterInput,
  TournamentRegisterOutput,
} from '../../entity/tabt-soap/TabTAPI_Port';
import { TabtClientSwitchingService } from './tabt-client-switching.service';
import { CredentialsService } from './credentials.service';
import { CacheService, TTL_DURATION } from '../cache/cache.service';
import { DatabaseContextService } from '../context/database-context.service';
import { LogtailLogger } from '../logger/logger.class';
import { DatadogService } from '../logger/datadog.service';


@Injectable()
export class TabtClientService {

  constructor(
    private readonly tabtClientSwitchingService: TabtClientSwitchingService,
    private readonly cacheService: CacheService,
    private readonly credentialsService: CredentialsService,
    private readonly databaseContextService: DatabaseContextService,
    private readonly datadog: DatadogService,
  ) {
    //this.logger.setContext(TabtClientService.name)
  }

  private enrichBodyAndQueryWithCache<T>(prefix: string, input: any, operation: (operation: any, options: any, headers: any) => Promise<T>, ttl) {
    const enrichedInput = this.credentialsService.enrichInputWithCredentials(input);
    const cacheKey = this.cacheService.getCacheKey(prefix, enrichedInput, this.databaseContextService.database);
    const getter: () => Promise<T> = () => {
      this.datadog.statsD.event('tabt-call', `Requesting ${prefix} data to TabT`, {alert_type: 'info'});
      return operation(enrichedInput, null, this.credentialsService.extraHeaders);
    };

    return this.cacheService.getFromCacheOrGetAndCacheResult(cacheKey, getter, ttl);
  }

  TestAsync(input: ITestInput): Promise<[TestOutput, string, { [k: string]: any; }, any, any]> {
    return this.tabtClientSwitchingService.tabtClient.TestAsync(this.credentialsService.enrichInputWithCredentials(input), null, this.credentialsService.extraHeaders);
  }

  GetSeasonsAsync(input: GetSeasonsInput): Promise<IGetSeasonsOutput> {
    const getter = async (input) => {
      const [result] = await this.tabtClientSwitchingService.tabtClient.GetSeasonsAsync(input);
      return result;
    };
    return this.enrichBodyAndQueryWithCache('season', input, getter, TTL_DURATION.ONE_DAY);
  }

  GetClubTeamsAsync(input: GetClubTeamsInput): Promise<GetClubTeamsOutput> {
    const getter = async (input) => {
      const [result] = await this.tabtClientSwitchingService.tabtClient.GetClubTeamsAsync(input);
      return result;
    };
    return this.enrichBodyAndQueryWithCache('club-teams', input, getter, TTL_DURATION.ONE_DAY);
  }

  GetDivisionRankingAsync(input: GetDivisionRankingInput): Promise<GetDivisionRankingOutput> {
    const getter = async (input) => {
      const [result] = await this.tabtClientSwitchingService.tabtClient.GetDivisionRankingAsync(input);
      return result;
    };
    return this.enrichBodyAndQueryWithCache('division-ranking', input, getter, TTL_DURATION.TWO_HOURS);
  }

  GetMatchesAsync(input: GetMatchesInput): Promise<GetMatchesOutput> {
    const getter = async (input) => {
      const [result] = await this.tabtClientSwitchingService.tabtClient.GetMatchesAsync(input);
      return result;
    };
    return this.enrichBodyAndQueryWithCache('matches', input, getter, TTL_DURATION.ONE_HOUR);
  }

  GetMembersAsync(input: GetMembersInput): Promise<IGetMembersOutput> {
    const getter = async (input) => {
      const [result] = await this.tabtClientSwitchingService.tabtClient.GetMembersAsync(input);
      return result;
    };
    return this.enrichBodyAndQueryWithCache('members', input, getter, TTL_DURATION.ONE_DAY);
  }

  UploadAsync(input: IUploadInput): Promise<[IUploadOutput, string, { [k: string]: any; }, any, any]> {
    return this.tabtClientSwitchingService.tabtClient.UploadAsync(this.credentialsService.enrichInputWithCredentials(input), null, this.credentialsService.extraHeaders);
  }

  GetClubsAsync(input: GetClubsInput): Promise<GetClubsOutput> {
    const getter = async (input) => {
      const [result] = await this.tabtClientSwitchingService.tabtClient.GetClubsAsync(input);
      return result;
    };
    return this.enrichBodyAndQueryWithCache('clubs', input, getter, TTL_DURATION.ONE_DAY);

  }

  GetDivisionsAsync(input: GetDivisionsInput): Promise<IGetDivisionsOutput> {
    const getter = async (input) => {
      const [result] = await this.tabtClientSwitchingService.tabtClient.GetDivisionsAsync(input);
      return result;
    };
    return this.enrichBodyAndQueryWithCache('divisions', input, getter, TTL_DURATION.ONE_DAY);

  }

  GetTournamentsAsync(input: GetTournamentsInput): Promise<IGetTournamentsOutput> {
    const getter = async (input) => {
      const [result] = await this.tabtClientSwitchingService.tabtClient.GetTournamentsAsync(input);
      return result;
    };
    return this.enrichBodyAndQueryWithCache('tournaments', input, getter, TTL_DURATION.EIGHT_HOURS);

  }

  GetMatchSystemsAsync(input: GetMatchSystemsInput): Promise<GetMatchSystemsOutput> {
    const getter = async (input) => {
      const [result] = await this.tabtClientSwitchingService.tabtClient.GetMatchSystemsAsync(input);
      return result;
    };
    return this.enrichBodyAndQueryWithCache('match-systems', input, getter, TTL_DURATION.ONE_DAY);
  }

  TournamentRegisterAsync(input: TournamentRegisterInput): Promise<[TournamentRegisterOutput, string, { [k: string]: any; }, any, any]> {
    return this.tabtClientSwitchingService.tabtClient.TournamentRegisterAsync(this.credentialsService.enrichInputWithCredentials(input), null, this.credentialsService.extraHeaders);
  }


}
