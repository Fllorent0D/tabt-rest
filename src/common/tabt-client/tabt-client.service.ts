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
import { CacheService } from '../cache/cache.service';
import { DatabaseContextService } from '../context/database-context.service';
import { PinoLogger } from 'nestjs-pino';

// Durations in Seconds
const ONE_DAY = 86_400;
const EIGHT_HOURS = 28_800;
const ONE_HOUR = 3_600;
const TWO_HOURS = 7_200;


@Injectable()
export class TabtClientService {

  constructor(
    private readonly tabtClientSwitchingService: TabtClientSwitchingService,
    private readonly cacheService: CacheService,
    private readonly credentialsService: CredentialsService,
    private readonly databaseContextService: DatabaseContextService,
    private readonly logger: PinoLogger
  ) {
    this.logger.setContext(TabtClientService.name)
  }

  private enrichBodyAndQueryWithCache<T>(prefix: string, input: any, operation: (operation: any, options: any, headers: any) => Promise<T>, ttl) {
    const enrichedInput = this.credentialsService.enrichInputWithCredentials(input);
    const cacheKey = CacheService.getCacheKey(prefix, enrichedInput, this.databaseContextService.database)
    const getter: () => Promise<T> = () => {
      this.logger.debug(`Requesting ${prefix} data to TabT`)
      return operation(enrichedInput, null, this.credentialsService.extraHeaders);
    }

    return this.cacheService.getFromCacheOrGetAndCacheResult(cacheKey, getter, ttl);
  }

  TestAsync(input: ITestInput): Promise<[TestOutput, string, { [k: string]: any; }, any, any]> {
    return this.tabtClientSwitchingService.tabtClient.TestAsync(this.credentialsService.enrichInputWithCredentials(input), null, this.credentialsService.extraHeaders);
  }

  GetSeasonsAsync(input: GetSeasonsInput): Promise<[IGetSeasonsOutput, string, { [k: string]: any; }, any, any]> {
    return this.enrichBodyAndQueryWithCache('season', input, this.tabtClientSwitchingService.tabtClient.GetSeasonsAsync, ONE_DAY);
  }

  GetClubTeamsAsync(input: GetClubTeamsInput): Promise<[GetClubTeamsOutput, string, { [k: string]: any; }, any, any]> {
    return this.enrichBodyAndQueryWithCache('club-teams', input, this.tabtClientSwitchingService.tabtClient.GetClubTeamsAsync, ONE_DAY);
  }

  GetDivisionRankingAsync(input: GetDivisionRankingInput): Promise<[GetDivisionRankingOutput, string, { [k: string]: any; }, any, any]> {
    return this.enrichBodyAndQueryWithCache('division-ranking', input, this.tabtClientSwitchingService.tabtClient.GetDivisionRankingAsync, TWO_HOURS);
  }

  GetMatchesAsync(input: GetMatchesInput): Promise<[GetMatchesOutput, string, { [k: string]: any; }, any, any]> {
    return this.enrichBodyAndQueryWithCache('matches', input, this.tabtClientSwitchingService.tabtClient.GetMatchesAsync, ONE_HOUR);
  }

  GetMembersAsync(input: GetMembersInput): Promise<[IGetMembersOutput, string, { [k: string]: any; }, any, any]> {
    return this.enrichBodyAndQueryWithCache('members', input, this.tabtClientSwitchingService.tabtClient.GetMembersAsync, ONE_DAY);
  }

  UploadAsync(input: IUploadInput): Promise<[IUploadOutput, string, { [k: string]: any; }, any, any]> {
    return this.tabtClientSwitchingService.tabtClient.UploadAsync(this.credentialsService.enrichInputWithCredentials(input), null, this.credentialsService.extraHeaders);
  }

  GetClubsAsync(input: GetClubsInput): Promise<[GetClubsOutput, string, { [k: string]: any; }, any, any]> {
    return this.enrichBodyAndQueryWithCache('clubs', input, this.tabtClientSwitchingService.tabtClient.GetClubsAsync, ONE_DAY);

  }

  GetDivisionsAsync(input: GetDivisionsInput): Promise<[result: IGetDivisionsOutput, raw: string, soapHeader: { [k: string]: any; }, options: any, extraHeaders: any]> {
    return this.enrichBodyAndQueryWithCache('divisions', input, this.tabtClientSwitchingService.tabtClient.GetDivisionsAsync, ONE_DAY);

  }

  GetTournamentsAsync(input: GetTournamentsInput): Promise<[IGetTournamentsOutput, string, { [k: string]: any; }, any, any]> {
    return this.enrichBodyAndQueryWithCache('tournaments', input, this.tabtClientSwitchingService.tabtClient.GetTournamentsAsync, EIGHT_HOURS);

  }

  GetMatchSystemsAsync(input: GetMatchSystemsInput): Promise<[GetMatchSystemsOutput, string, { [k: string]: any; }, any, any]> {
    return this.enrichBodyAndQueryWithCache('match-systems', input, this.tabtClientSwitchingService.tabtClient.GetMatchSystemsAsync, ONE_DAY);
  }

  TournamentRegisterAsync(input: TournamentRegisterInput): Promise<[TournamentRegisterOutput, string, { [k: string]: any; }, any, any]> {
    return this.tabtClientSwitchingService.tabtClient.TournamentRegisterAsync(this.credentialsService.enrichInputWithCredentials(input), null, this.credentialsService.extraHeaders);
  }


}
