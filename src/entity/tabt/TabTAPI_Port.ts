import { Client } from 'soap';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';

export class Credentials {

  Account: string;

  Password: string;

  OnBehalfOf?: number;
}

/* tslint:disable:max-line-length no-empty-class */
export class ITestInput {
  Credentials: Credentials;
}

export enum Level {
  NATIONAL = 1,
  HAINAUT = 4,
  VLAAMS_BRABANT_BR = 5,
  SUPER_DIVISION = 6,
  OOST_VLANDEREN = 7,
  ANTWERP = 8,
  WEST_VLAANDEREN = 9,
  LIMBURG = 10,
  BRUSSELS_BRABANT_WALLON = 11,
  NAMUR = 12,
  LIEGE = 13,
  LUXEMBOURG = 14,
  REGION_VTTL = 15,
  IWB = 16,
}

enum MemberStatus {
  ACTIVE = 'A',
  ADMINISTRATIVE = 'M',
  NON_ACTIVE = 'I',
  RECREANT = 'R',
  RECREANT_RESERVE = 'V',
  DOUBLE_AFFILIATION = 'D',
  DOUBLE_AFFILIATION_SUPER = 'T',
  SUPER_DIVISION = 'S',
  LICENCE_A = 'C',
  INDIVIDUAL_PLAYER = 'N',
  EXTERN = 'E'
}

enum DivisionCategory {
  MEN = 1,
  WOMEN = 2,
  VETERANS = 3,
  VETERANS_WOMEN = 4,
  YOUTH = 5,
}

export class VenueEntry {

  @ApiProperty()
  Id: number;

  @ApiProperty()
  ClubVenue: number;

  @ApiProperty()
  Name: string;

  @ApiProperty()
  Street: string;

  @ApiProperty()
  Town: string;

  @ApiProperty()
  Phone: string;

  @ApiProperty()
  Comment: string;
}

export class ITestOutput {
  /** xsd:string(undefined) */
  Timestamp: string;
  /** xsd:string(undefined) */
  ApiVersion: string;
  /** xsd:boolean(undefined) */
  IsValidAccount: boolean;
  /** SupportedLanguages(en,fr,nl) */
  Language: 'en' | 'fr' | 'nl';
  /** xsd:string(undefined) */
  Database: string;
  /** xsd:string(undefined) */
  RequestorIp: string;
  /** xsd:number(undefined) */
  ConsumedTicks: number;
  /** xsd:number(undefined) */
  CurrentQuota: number;
  /** xsd:number(undefined) */
  AllowedQuota: number;
  /** xsd:string(undefined) */
  PhpVersion: string;
  /** xsd:string(undefined) */
  DbVersion: string;
}

export class GetSeasonsInput {
  Credentials: Credentials;
}

export class IGetSeasonsOutput {
  /** xsd:number(undefined) */
  CurrentSeason: number;
  /** xsd:string(undefined) */
  CurrentSeasonName: string;
  SeasonEntries: Array<SeasonEntry>;
}

export class GetClubTeamsInput {
  Credentials: Credentials;
  /** xsd:string(undefined) */
  @ApiPropertyOptional()
  Club: string;
  /** xsd:number(undefined) */
  @ApiPropertyOptional()
  Season: number;
}

export class GetClubTeamsOutput {
  /** xsd:string(undefined) */
  ClubName: string;
  /** xsd:number(undefined) */
  TeamCount: number;
  TeamEntries: Array<TeamEntry>;
}

export class GetDivisionRankingInput {
  Credentials: Credentials;
  /** xsd:number(undefined) */
  DivisionId: number;
  /** xsd:string(undefined) */
  @ApiPropertyOptional()
  WeekName: string;
  /** xsd:number(undefined) */
  @ApiPropertyOptional()
  RankingSystem: number;
}

export class RankingEntry {

  @ApiProperty()
  Position: number;

  @ApiProperty()
  Team: string;

  @ApiProperty()
  GamesPlayed: number;

  @ApiProperty()
  GamesWon: number;

  @ApiProperty()
  GamesLost: number;

  @ApiProperty()
  GamesDraw: number;

  @ApiProperty()
  GamesWO: number;

  @ApiProperty()
  IndividualMatchesWon: number;

  @ApiProperty()
  IndividualMatchesLost: number;

  @ApiProperty()
  IndividualSetsWon: number;

  @ApiProperty()
  IndividualSetsLost: number;

  @ApiProperty()
  Points: number;

  @ApiProperty()
  TeamClub: string;
}

export class GetDivisionRankingOutput {
  /** xsd:string(undefined) */
  @ApiProperty()
  DivisionName: string;
  @ApiProperty({
    type: [RankingEntry],
  })
  RankingEntries: Array<RankingEntry>;
}

export class GetMatchesInput {
  Credentials: Credentials;
  /** xsd:number(undefined) */
  @ApiPropertyOptional()
  DivisionId: number;
  /** xsd:string(undefined) */
  @ApiPropertyOptional()
  Club: string;
  /** xsd:string(undefined) */
  @ApiPropertyOptional()
  Team: string;
  /** xsd:number(undefined) */
  @ApiPropertyOptional()
  DivisionCategory: number;
  /** xsd:number(undefined) */
  @ApiPropertyOptional()
  Season: number;
  /** xsd:string(undefined) */
  @ApiPropertyOptional()
  WeekName: string;
  /** xsd:number(undefined) */
  @ApiPropertyOptional()
  Level: number;
  /** ShowDivisionNameType(no,yes,short) */
  @ApiPropertyOptional()
  ShowDivisionName: 'no' | 'yes' | 'short';
  /** xsd:date(undefined) */
  @ApiPropertyOptional()
  YearDateFrom: string;
  /** xsd:date(undefined) */
  @ApiPropertyOptional()
  YearDateTo: string;
  /** xsd:boolean(undefined) */
  @ApiPropertyOptional()
  WithDetails: boolean;
  /** xsd:string(undefined) */
  @ApiPropertyOptional()
  MatchId: string;
  /** xsd:string(undefined) */
  @ApiPropertyOptional()
  MatchUniqueId: string;
}

export class GetMatchesOutput {
  /** xsd:number(undefined) */
  MatchCount: number;
  TeamMatchesEntries: Array<TeamMatchesEntry>;
}

export class GetMembersInput {
  Credentials: Credentials;
  /** xsd:string(undefined) */
  @ApiPropertyOptional()
  Club: string;
  /** xsd:number(undefined) */
  @ApiPropertyOptional()
  Season: number;
  /** xsd:number(undefined) */
  @ApiPropertyOptional()
  PlayerCategory: number;
  /** xsd:number(undefined) */
  @ApiPropertyOptional()
  UniqueIndex: number;
  /** xsd:string(undefined) */
  @ApiPropertyOptional()
  NameSearch: string;
  /** xsd:boolean(undefined) */
  @ApiPropertyOptional()
  ExtendedInformation: boolean;
  /** xsd:boolean(undefined) */
  @ApiPropertyOptional()
  RankingPointsInformation: boolean;
  /** xsd:boolean(undefined) */
  @ApiPropertyOptional()
  WithResults: boolean;
  /** xsd:boolean(undefined) */
  @ApiPropertyOptional()
  WithOpponentRankingEvaluation: boolean;
}

export class GetMembersInputFromClub extends OmitType(GetMembersInput, ['Club'] as const) {
}

export class GetTeamsInputFromClub extends OmitType(GetClubTeamsInput, ['Club'] as const) {
}

export class IGetMembersOutput {
  /** xsd:number(undefined) */
  MemberCount: number;
  MemberEntries: Array<MemberEntry>;
}

export class IUploadInput {
  Credentials: Credentials;
  /** xsd:string(undefined) */
  Data: string;
}

export class IUploadOutput {
  /** xsd:boolean(undefined) */
  Result: boolean;
  /** xsd:string(undefined) */
  ErrorLines: Array<string>;
}

export class GetClubsInput {
  Credentials: Credentials;
  /** xsd:number(undefined) */
  @ApiPropertyOptional()
  Season?: number;
  /** xsd:number(undefined) */
  @ApiPropertyOptional()
  ClubCategory?: number;
  /** xsd:string(undefined) */
  Club?: string;
}

export class GetClubsOutput {
  /** xsd:number(undefined) */
  ClubCount: number;
  ClubEntries: Array<ClubEntry>;
}

export class GetDivisionsInput {

  Credentials?: Credentials;
  /** xsd:number(undefined) */
  @ApiPropertyOptional()
  Season?: number;
  /** xsd:number(undefined) */
  @ApiPropertyOptional({ type: Number })
  Level?: number;
  /** ShowDivisionNameType(no,yes,short) */
  @ApiPropertyOptional({ enum: ['no', 'yes', 'short'] })
  ShowDivisionName?: 'no' | 'yes' | 'short';
}

export class IGetDivisionsOutput {
  /** xsd:number(undefined) */
  DivisionCount: number;
  DivisionEntries: Array<DivisionEntry>;
}

export class GetTournamentsInput {
  Credentials?: Credentials;

  Season?: number;

  TournamentUniqueIndex?: number;

  WithResults?: boolean;

  WithRegistrations?: boolean;
}

export class IGetTournamentsOutput {
  /** xsd:number(undefined) */
  TournamentCount: number;
  TournamentEntries: Array<TournamentEntry>;
}

export class IGetMatchSystemsInput {
  Credentials: Credentials;
  /** xsd:number(undefined) */
  UniqueIndex: number;
}

export class IGetMatchSystemsOutput {
  /** xsd:number(undefined) */
  MatchSystemCount: number;
  MatchSystemEntries: Array<IMatchSystemEntries>;
}

export class TournamentRegisterInput {
  Credentials?: Credentials;
  /** xsd:number(undefined) */
  TournamentUniqueIndex?: number;
  /** xsd:number(undefined) */
  SerieUniqueIndex?: number;
  /** xsd:number(undefined) */
  PlayerUniqueIndex?: Array<number>;
  /** xsd:boolean(undefined) */
  Unregister?: boolean;
  /** xsd:boolean(undefined) */
  NotifyPlayer?: boolean;
}

export class TournamentRegisterOutput {
  @ApiProperty()
  Success: boolean;

  @ApiProperty()
  MessageCount: number;

  @ApiProperty()
  MessageEntries: Array<string>;
}

export class TabTAPISoap extends Client {
  Test: (input: ITestInput, cb: (err: any | null, result: ITestOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
  GetSeasons: (input: GetSeasonsInput, cb: (err: any | null, result: IGetSeasonsOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
  GetClubTeams: (input: GetClubTeamsInput, cb: (err: any | null, result: GetClubTeamsOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
  GetDivisionRanking: (input: GetDivisionRankingInput, cb: (err: any | null, result: GetDivisionRankingOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
  GetMatches: (input: GetMatchesInput, cb: (err: any | null, result: GetMatchesOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
  GetMembers: (input: GetMembersInput, cb: (err: any | null, result: IGetMembersOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
  Upload: (input: IUploadInput, cb: (err: any | null, result: IUploadOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
  GetClubs: (input: GetClubsInput, cb: (err: any | null, result: GetClubsOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
  GetDivisions: (input: GetDivisionsInput, cb: (err: any | null, result: IGetDivisionsOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
  GetTournaments: (input: GetTournamentsInput, cb: (err: any | null, result: IGetTournamentsOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
  GetMatchSystems: (input: IGetMatchSystemsInput, cb: (err: any | null, result: IGetMatchSystemsOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
  TournamentRegister: (input: TournamentRegisterInput, cb: (err: any | null, result: TournamentRegisterOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;

  TestAsync: (input: ITestInput) => Promise<[ITestOutput, string, { [k: string]: any; }, any, any]>;
  GetSeasonsAsync: (input: GetSeasonsInput) => Promise<[IGetSeasonsOutput, string, { [k: string]: any; }, any, any]>;
  GetClubTeamsAsync: (input: GetClubTeamsInput) => Promise<[GetClubTeamsOutput, string, { [k: string]: any; }, any, any]>;
  GetDivisionRankingAsync: (input: GetDivisionRankingInput) => Promise<[GetDivisionRankingOutput, string, { [k: string]: any; }, any, any]>;
  GetMatchesAsync: (input: GetMatchesInput) => Promise<[GetMatchesOutput, string, { [k: string]: any; }, any, any]>;
  GetMembersAsync: (input: GetMembersInput) => Promise<[IGetMembersOutput, string, { [k: string]: any; }, any, any]>;
  UploadAsync: (input: IUploadInput) => Promise<[IUploadOutput, string, { [k: string]: any; }, any, any]>;
  GetClubsAsync: (input: GetClubsInput) => Promise<[GetClubsOutput, string, { [k: string]: any; }, any, any]>;
  GetDivisionsAsync: (input: GetDivisionsInput) => Promise<[result: IGetDivisionsOutput, raw: string, soapHeader: { [k: string]: any; }, options: any, extraHeaders: any]>;
  GetTournamentsAsync: (input: GetTournamentsInput) => Promise<[IGetTournamentsOutput, string, { [k: string]: any; }, any, any]>;
  GetMatchSystemsAsync: (input: IGetMatchSystemsInput) => Promise<[IGetMatchSystemsOutput, string, { [k: string]: any; }, any, any]>;
  TournamentRegisterAsync: (input: TournamentRegisterInput) => Promise<[TournamentRegisterOutput, string, { [k: string]: any; }, any, any]>;
}

export class SeasonEntry {

  @ApiProperty()
  Season: number;

  @ApiProperty()
  Name: string;

  @ApiProperty()
  IsCurrent: boolean;
}

export class TeamEntry {

  @ApiProperty()
  TeamId: string;

  @ApiProperty()
  Team: string;

  @ApiProperty()
  DivisionId: number;

  @ApiProperty()
  DivisionName: string;

  @ApiProperty()
  DivisionCategory: number;

  @ApiProperty()
  MatchType: number;
}


export class Player {

  @ApiProperty()
  Position: number;

  @ApiProperty()
  UniqueIndex: number;

  @ApiProperty()
  FirstName: string;

  @ApiProperty()
  LastName: string;

  @ApiProperty()
  Ranking: string;

  @ApiProperty()
  VictoryCount: number;

  @ApiProperty()
  IsForfeited: boolean;
}

export class DoubleTeam {

  @ApiProperty()
  Position: number;

  @ApiProperty()
  Team: string;

  @ApiProperty()
  IsForfeited: boolean;
}

export class Players {
  @ApiProperty()
  PlayerCount: number;

  @ApiProperty()
  DoubleTeamCount: number;

  @ApiPropertyOptional({ type: [Player] })
  Players: Array<Player>;

  @ApiPropertyOptional({ type: [DoubleTeam] })
  DoubleTeams: Array<DoubleTeam>;
}


export class IAwayPlayer {

  Position: number;

  UniqueIndex: number;

  FirstName: string;

  LastName: string;

  Ranking: string;

  VictoryCount: number;

  IsForfeited: boolean;
}

export class IndividualMatchResult {
  @ApiProperty()
  Position: number;
  @ApiProperty()
  HomePlayerMatchIndex: Array<number>;

  @ApiProperty()
  HomePlayerUniqueIndex: Array<number>;

  @ApiProperty()
  AwayPlayerMatchIndex: Array<number>;

  @ApiProperty()
  AwayPlayerUniqueIndex: Array<number>;

  @ApiProperty()
  HomeSetCount: number;

  @ApiProperty()
  AwaySetCount: number;

  @ApiProperty()
  IsHomeForfeited: boolean;

  @ApiProperty()
  IsAwayForfeited: boolean;

  @ApiProperty()
  Scores: string;
}

export class RankingPointsEntry {

  @ApiProperty()
  MethodName: string;

  @ApiProperty()
  Value: string;

  @ApiProperty()
  LastModified: string;
}

export class Phone {

  @ApiProperty()
  Home: string;

  @ApiProperty()
  Work: string;

  @ApiProperty()
  Mobile: string;

  @ApiProperty()
  Fax: string;
}

export class Address {

  @ApiProperty()
  Line1: string;

  @ApiProperty()
  Line2: string;

  @ApiProperty()
  ZipCode: number;

  @ApiProperty()
  Town: string;
}

export class RankingEvaluationEntry {

  @ApiProperty()
  EvaluationType: string;

  @ApiProperty()
  EvaluationValue: string;
}

export class CommentAuthor {

  @ApiProperty()
  Position: number;

  @ApiProperty()
  UniqueIndex: number;

  @ApiProperty()
  RankingIndex: number;

  @ApiProperty()
  FirstName: string;

  @ApiProperty()
  LastName: string;

  @ApiProperty()
  Ranking: string;

  @ApiProperty()
  Status: string;

  @ApiProperty()
  Club: string;
  /** http://api.frenoy.net/TabTAPI#GenderType(M,F) */
  @ApiProperty()
  Gender: 'M' | 'F';

  Category: string;
  /** http://api.frenoy.net/TabTAPI#xsd:date(undefined) */
  BirthDate: string;

  MedicalAttestation: boolean;

  RankingPointsCount: number;
  RankingPointsEntries: Array<RankingPointsEntry>;

  Email: string;
  Phone: Phone;
  Address: Address;

  ResultCount: number;
  ResultEntries: Array<{
    /** http://api.frenoy.net/TabTAPI#xsd:date(undefined) */
    Date: string;

    UniqueIndex: number;

    FirstName: string;

    LastName: string;

    Ranking: string;
    /** http://api.frenoy.net/TabTAPI#ResultType(V,D) */
    Result: 'V' | 'D';

    SetFor: number;

    SetAgainst: number;
    /** http://api.frenoy.net/TabTAPI#CompetitionType(C,T) */
    CompetitionType: 'C' | 'T';

    Club: string;

    MatchId: string;

    TournamentName: string;

    TournamentSerieName: string;

    TeamName: string;

    RankingEvaluationCount: number;
    RankingEvaluationEntries: Array<RankingEvaluationEntry>;
  }>;

  NationalNumber: string;
}

export class CommentEntry {

  @ApiProperty()
  Timestamp: string;

  @ApiProperty()
  Author: CommentAuthor;

  @ApiProperty()
  Comment: string;

  @ApiProperty()
  Code: string;
}

export class MatchDetails {

  @ApiProperty()
  DetailsCreated: boolean;
  /** http://api.frenoy.net/TabTAPI#xsd:time(undefined) */
  @ApiProperty()
  StartTime: string;
  /** http://api.frenoy.net/TabTAPI#xsd:time(undefined) */
  @ApiProperty()
  EndTime: string;

  @ApiProperty()
  HomeCaptain: number;

  @ApiProperty()
  AwayCaptain: number;

  @ApiProperty()
  Referee: number;

  @ApiProperty()
  HallCommissioner: number;

  @ApiProperty()
  HomePlayers: Players;

  @ApiProperty()
  AwayPlayers: Players;

  @ApiProperty({ type: [IndividualMatchResult] })
  IndividualMatchResults: Array<IndividualMatchResult>;

  @ApiProperty()
  MatchSystem: number;

  @ApiProperty()
  HomeScore: number;

  @ApiProperty()
  AwayScore: number;

  @ApiProperty()
  CommentCount: number;
  @ApiProperty()
  CommentEntries: Array<CommentEntry>;
}

export class TeamMatchesEntry {

  @ApiPropertyOptional()
  DivisionName: string;

  @ApiProperty()
  MatchId: string;

  @ApiProperty()
  WeekName: string;
  /** http://api.frenoy.net/TabTAPI#xsd:date(undefined) */
  @ApiProperty()
  Date: string;
  /** http://api.frenoy.net/TabTAPI#xsd:time(undefined) */
  @ApiProperty()
  Time: string;

  @ApiProperty()
  Venue: number;

  @ApiProperty()
  VenueClub: string;
  @ApiProperty()
  VenueEntry: VenueEntry;

  @ApiProperty()
  HomeClub: string;

  @ApiProperty()
  HomeTeam: string;

  @ApiProperty()
  AwayClub: string;

  @ApiProperty()
  AwayTeam: string;

  @ApiProperty()
  Score: string;

  @ApiProperty()
  MatchUniqueId: number;

  @ApiProperty()
  NextWeekName: string;

  @ApiProperty()
  PreviousWeekName: string;

  @ApiProperty()
  IsHomeForfeited: boolean;

  @ApiProperty()
  IsAwayForfeited: boolean;

  @ApiPropertyOptional()
  MatchDetails: MatchDetails;

  @ApiProperty()
  DivisionId: number;

  @ApiProperty()
  DivisionCategory: number;

  @ApiProperty()
  IsHomeWithdrawn: string;

  @ApiProperty()
  IsAwayWithdrawn: string;

  @ApiProperty()
  IsValidated: boolean;

  @ApiProperty()
  IsLocked: boolean;
}

export class MemberEntryResultEntry {
  /** http://api.frenoy.net/TabTAPI#xsd:date(undefined) */
  @ApiProperty()
  Date: string;

  @ApiProperty()
  UniqueIndex: number;

  @ApiProperty()
  FirstName: string;

  @ApiProperty()
  LastName: string;

  @ApiProperty()
  Ranking: string;
  /** http://api.frenoy.net/TabTAPI#ResultType(V,D) */
  @ApiProperty()
  Result: 'V' | 'D';

  @ApiProperty()
  SetFor: number;

  @ApiProperty()
  SetAgainst: number;
  /** http://api.frenoy.net/TabTAPI#CompetitionType(C,T) */
  @ApiProperty()
  CompetitionType: 'C' | 'T';

  @ApiProperty()
  Club: string;

  @ApiPropertyOptional()
  MatchId: string;

  @ApiPropertyOptional()
  TournamentName: string;

  @ApiPropertyOptional()
  TournamentSerieName: string;

  @ApiPropertyOptional()
  TeamName: string;

  @ApiPropertyOptional()
  RankingEvaluationCount: number;
  @ApiPropertyOptional({ type: [RankingEvaluationEntry] })
  RankingEvaluationEntries: Array<RankingEvaluationEntry>;
}

export class MemberEntry {

  @ApiProperty()
  Position: number;

  @ApiProperty()
  UniqueIndex: number;

  @ApiProperty()
  RankingIndex: number;

  @ApiProperty()
  FirstName: string;

  @ApiProperty()
  LastName: string;

  @ApiProperty()
  Ranking: string;

  @ApiProperty()
  Status: string;

  @ApiProperty()
  Club: string;
  /** http://api.frenoy.net/TabTAPI#GenderType(M,F) */
  @ApiProperty()
  Gender: 'M' | 'F';

  @ApiProperty()
  Category: string;
  /** http://api.frenoy.net/TabTAPI#xsd:date(undefined) */
  @ApiPropertyOptional()
  BirthDate: string;

  @ApiPropertyOptional()
  MedicalAttestation: boolean;

  @ApiPropertyOptional()
  RankingPointsCount: number;
  @ApiPropertyOptional({ type: [RankingPointsEntry] })
  RankingPointsEntries: Array<RankingPointsEntry>;

  @ApiPropertyOptional()
  Email: string;
  @ApiPropertyOptional()
  Phone: Phone;
  @ApiPropertyOptional()
  Address: Address;

  @ApiPropertyOptional()
  ResultCount: number;
  @ApiPropertyOptional({ type: [MemberEntryResultEntry] })
  ResultEntries: Array<MemberEntryResultEntry>;

  @ApiPropertyOptional()
  NationalNumber: string;
}

export class ClubEntry {

  @ApiProperty()
  UniqueIndex: string;

  @ApiProperty()
  Name: string;

  @ApiProperty()
  LongName: string;

  @ApiProperty()
  Category: number;

  @ApiProperty()
  CategoryName: string;

  @ApiProperty()
  VenueCount: number;

  @ApiProperty({ type: [VenueEntry] })
  VenueEntries: Array<VenueEntry>;
}


export class DivisionEntry {

  @ApiProperty()
  DivisionId: number;

  @ApiPropertyOptional()
  DivisionName: string;

  @ApiProperty()
  DivisionCategory: number;

  @ApiProperty()
  Level: Level;

  @ApiProperty()
  MatchType: number;
}

export class RegistrationEntry {
  @ApiProperty()
  UniqueIndex: number;
  @ApiProperty()
  Member: MemberEntry;
  @ApiProperty()
  Club: ClubEntry;
}

export class TournamentSerieResultEntry {
  @ApiProperty()
  Position: number;

  @ApiProperty()
  HomePlayerMatchIndex: Array<number>;

  @ApiProperty()
  HomePlayerUniqueIndex: Array<number>;

  @ApiProperty()
  AwayPlayerMatchIndex: Array<number>;

  @ApiProperty()
  AwayPlayerUniqueIndex: Array<number>;

  @ApiProperty()
  HomeSetCount: number;

  @ApiProperty()
  AwaySetCount: number;

  @ApiProperty()
  IsHomeForfeited: boolean;
  @ApiProperty()
  IsAwayForfeited: boolean;

  @ApiProperty()
  Scores: string;
  @ApiProperty({ type: [Player] })
  HomePlayer: Array<Player>;
  @ApiProperty({ type: [Player] })
  AwayPlayer: Array<Player>;

}

export class TournamentSerieEntry {
  @ApiProperty()
  UniqueIndex: number;

  @ApiProperty()
  Name: string;

  @ApiProperty()
  ResultCount: number;

  @ApiProperty()
  ResultEntries: Array<TournamentSerieResultEntry>;
  @ApiProperty()
  RegistrationCount: number;
  @ApiProperty()
  RegistrationEntries: Array<RegistrationEntry>;
}

export class TournamentEntry {
  @ApiProperty()
  UniqueIndex: number;

  @ApiProperty()
  Name: string;

  @ApiProperty()
  Level: number;

  @ApiProperty()
  ExternalIndex: string;
  /** http://api.frenoy.net/TabTAPI#xsd:date(undefined) */
  @ApiProperty()
  DateFrom: string;
  /** http://api.frenoy.net/TabTAPI#xsd:date(undefined) */
  @ApiProperty()
  DateTo: string;
  /** http://api.frenoy.net/TabTAPI#xsd:date(undefined) */
  @ApiProperty()
  RegistrationDate: string;

  @ApiProperty()
  Venue: VenueEntry;

  @ApiProperty()
  SerieCount: number;
  @ApiProperty()
  SerieEntries: Array<TournamentSerieEntry>;
}

export class ITeamMatchDefinitionEntries {

  Position: number;

  Type: number;

  HomePlayerIndex: number;

  AwayPlayerIndex: number;

  AllowSubstitute: boolean;
}

export class IMatchSystemEntries {

  UniqueIndex: number;

  Name: string;

  SingleMatchCount: number;

  DoubleMatchCount: number;

  SetCount: number;

  PointCount: number;

  ForcedDoubleTeams: boolean;

  SubstituteCount: number;

  TeamMatchCount: number;
  TeamMatchDefinitionEntries: Array<ITeamMatchDefinitionEntries>;
}

