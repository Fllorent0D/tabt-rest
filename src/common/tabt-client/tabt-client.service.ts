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
  GetMembersInput,
  GetSeasonsInput,
  GetTournamentsInput,
  IGetDivisionsOutput,
  IGetMatchSystemsInput,
  IGetMatchSystemsOutput,
  IGetMembersOutput,
  IGetSeasonsOutput,
  IGetTournamentsOutput,
  ITestInput,
  ITestOutput,
  IUploadInput,
  IUploadOutput,
  TournamentRegisterInput,
  TournamentRegisterOutput,
} from '../../entity/tabt/TabTAPI_Port';
import { TabtClientSwitchingService } from './tabt-client-switching.service';
import { CredentialsService } from './credentials.service';
import { CacheService } from '../cache/cache.service';
import { JsonUtil } from '../utils/json.util';
import { DatabaseContextService } from '../context/database-context.service';

const DecoratedParameter = (
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
) => {
  console.log(target);
  console.log(propertyKey);
  console.log(parameterIndex);
};


@Injectable()
export class TabtClientService {

  constructor(
    private readonly tabtClientSwitching: TabtClientSwitchingService,
    private readonly cacheService: CacheService,
    private readonly credentialsService: CredentialsService,
    private readonly languageContextService: DatabaseContextService
  ) {
  }

  private async getFromCacheOrRequest<T>(key: string, input: any, getter: (_: any) => Promise<T>, ttl = 600): Promise<T> {
    const enrichedInput = this.credentialsService.enrichInputWithCredentials(input);
    const db = this.languageContextService.language
    const cacheKey = `${key}-${db}-${JsonUtil.stringifyObject(enrichedInput)}`;
    const cached = await this.cacheService.getFromCache<T>(cacheKey);

    if (cached) {
      console.log('FOUND:::', cacheKey)
      return cached;
    } else {
      console.log('NOT FOUND:::', cacheKey)

    }

    const result = await getter(enrichedInput);
    await this.cacheService.setInCache(cacheKey, result, ttl);
    return result;
  }

  async TestAsync(input: ITestInput): Promise<[ITestOutput, string, { [k: string]: any; }, any, any]> {
    return this.getFromCacheOrRequest('test', input, (i) => this.tabtClientSwitching.tabtClient.TestAsync(i));
  }

  GetSeasonsAsync(input: GetSeasonsInput): Promise<[IGetSeasonsOutput, string, { [k: string]: any; }, any, any]> {
    return this.getFromCacheOrRequest('season', input, (i) => this.tabtClientSwitching.tabtClient.GetSeasonsAsync(i));
  }

  GetClubTeamsAsync(input: GetClubTeamsInput): Promise<[GetClubTeamsOutput, string, { [k: string]: any; }, any, any]> {
    return this.getFromCacheOrRequest('club-teams', input, (i) => this.tabtClientSwitching.tabtClient.GetClubTeamsAsync(i));
  }

  GetDivisionRankingAsync(input: GetDivisionRankingInput): Promise<[GetDivisionRankingOutput, string, { [k: string]: any; }, any, any]> {
    return this.getFromCacheOrRequest('division-ranking', input, (i) => this.tabtClientSwitching.tabtClient.GetDivisionRankingAsync(i));

  }

  GetMatchesAsync(input: GetMatchesInput): Promise<[GetMatchesOutput, string, { [k: string]: any; }, any, any]> {
    return this.getFromCacheOrRequest('matches', input, (i) => this.tabtClientSwitching.tabtClient.GetMatchesAsync(i));

  }

  GetMembersAsync(input: GetMembersInput): Promise<[IGetMembersOutput, string, { [k: string]: any; }, any, any]> {
    return this.getFromCacheOrRequest('members', input, (i) => this.tabtClientSwitching.tabtClient.GetMembersAsync(i));

  }

  UploadAsync(input: IUploadInput): Promise<[IUploadOutput, string, { [k: string]: any; }, any, any]> {
    return this.tabtClientSwitching.tabtClient.UploadAsync(this.credentialsService.enrichInputWithCredentials(input));

  }

  GetClubsAsync(input: GetClubsInput): Promise<[GetClubsOutput, string, { [k: string]: any; }, any, any]> {
    return this.getFromCacheOrRequest('clubs', input, (i) => this.tabtClientSwitching.tabtClient.GetClubsAsync(i));

  }

  GetDivisionsAsync(input: GetDivisionsInput): Promise<[result: IGetDivisionsOutput, raw: string, soapHeader: { [k: string]: any; }, options: any, extraHeaders: any]> {
    return this.getFromCacheOrRequest('divisions', input, (i) => this.tabtClientSwitching.tabtClient.GetDivisionsAsync(i));

  }

  GetTournamentsAsync(input: GetTournamentsInput): Promise<[IGetTournamentsOutput, string, { [k: string]: any; }, any, any]> {
    return this.getFromCacheOrRequest('tournaments', input, (i) => this.tabtClientSwitching.tabtClient.GetTournamentsAsync(i));

  }

  GetMatchSystemsAsync(input: IGetMatchSystemsInput): Promise<[IGetMatchSystemsOutput, string, { [k: string]: any; }, any, any]> {
    return this.getFromCacheOrRequest('match-systems', input, (i) => this.tabtClientSwitching.tabtClient.GetMatchSystemsAsync(i));

  }

  TournamentRegisterAsync(input: TournamentRegisterInput): Promise<[TournamentRegisterOutput, string, { [k: string]: any; }, any, any]> {
    return this.tabtClientSwitching.tabtClient.TournamentRegisterAsync(this.credentialsService.enrichInputWithCredentials(input));
  }


}
