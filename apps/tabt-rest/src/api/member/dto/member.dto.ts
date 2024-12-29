import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PlayerCategory } from '../../../entity/tabt-input.interface';
import { RequestBySeasonDto } from '../../../common/dto/request-by-season.dto';
import {
  MemberEntry,
  RankingPointsEntry,
  Phone,
  Address,
  RankingEvaluationEntry,
  MemberEntryResultEntry,
} from '../../../entity/tabt-soap/TabTAPI_Port';
import { PlayerCategoryDTO } from 'apps/tabt-rest/src/common/dto/player-category.dto';

export class BaseGetMembers {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  club?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform((id) => parseInt(id.value), { toClassOnly: true })
  uniqueIndex?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nameSearch?: string;

  @ApiPropertyOptional()
  @Transform((a) => Boolean(a.value))
  @IsBoolean()
  @IsOptional()
  extendedInformation?: boolean;

  @ApiPropertyOptional()
  @Transform((a) => Boolean(a.value))
  @IsBoolean()
  @IsOptional()
  rankingPointsInformation?: boolean;

  @ApiPropertyOptional()
  @Transform((a) => a.value === 'true')
  @IsBoolean()
  @IsOptional()
  withResults?: boolean;

  @ApiPropertyOptional()
  @Transform((a) => Boolean(a.value))
  @IsBoolean()
  @IsOptional()
  withOpponentRankingEvaluation?: boolean;
}

export class GetMembers extends BaseGetMembers {
  @ApiPropertyOptional({ enum: PlayerCategory })
  @IsOptional()
  @IsEnum(PlayerCategory)
  playerCategory?: string;
}

export class GetMember extends OmitType(GetMembers, ['uniqueIndex']) {}

export class GetMembersV2 extends BaseGetMembers {
  @ApiPropertyOptional({ enum: PlayerCategoryDTO })
  @IsOptional()
  @IsEnum(PlayerCategoryDTO)
  playerCategory?: PlayerCategoryDTO;
}

export class GetMemberV2 extends OmitType(GetMembersV2, ['uniqueIndex']) {}

export class RankingPointsEntryDTO {
  @ApiProperty()
  MethodName: string;

  @ApiProperty()
  Value: string;

  @ApiProperty()
  LastModified: string;

  static fromTabT(entry: RankingPointsEntry): RankingPointsEntryDTO {
    const dto = new RankingPointsEntryDTO();
    dto.MethodName = entry.MethodName;
    dto.Value = entry.Value;
    dto.LastModified = entry.LastModified;
    return dto;
  }
}

export class PhoneDTO {
  @ApiProperty()
  Home: string;

  @ApiProperty()
  Work: string;

  @ApiProperty()
  Mobile: string;

  @ApiProperty()
  Fax: string;

  static fromTabT(phone: Phone): PhoneDTO {
    const dto = new PhoneDTO();
    dto.Home = phone.Home;
    dto.Work = phone.Work;
    dto.Mobile = phone.Mobile;
    dto.Fax = phone.Fax;
    return dto;
  }
}

export class AddressDTO {
  @ApiProperty()
  Line1: string;

  @ApiProperty()
  Line2: string;

  @ApiProperty()
  ZipCode: number;

  @ApiProperty()
  Town: string;

  static fromTabT(address: Address): AddressDTO {
    const dto = new AddressDTO();
    dto.Line1 = address.Line1;
    dto.Line2 = address.Line2;
    dto.ZipCode = address.ZipCode;
    dto.Town = address.Town;
    return dto;
  }
}

export class RankingEvaluationEntryDTO {
  @ApiProperty()
  EvaluationType: string;

  @ApiProperty()
  EvaluationValue: string;

  static fromTabT(entry: RankingEvaluationEntry): RankingEvaluationEntryDTO {
    const dto = new RankingEvaluationEntryDTO();
    dto.EvaluationType = entry.EvaluationType;
    dto.EvaluationValue = entry.EvaluationValue;
    return dto;
  }
}

export class MemberEntryResultEntryDTO {
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
  @ApiProperty({ enum: ['C', 'T'] })
  CompetitionType: 'C' | 'T';

  @ApiProperty()
  Club: string;

  @ApiPropertyOptional()
  MatchId: string;

  @ApiPropertyOptional()
  MatchUniqueId: string;

  @ApiPropertyOptional()
  TournamentName: string;

  @ApiPropertyOptional()
  TournamentSerieName: string;

  @ApiPropertyOptional()
  TeamName: string;

  @ApiPropertyOptional()
  RankingEvaluationCount: number;

  @ApiPropertyOptional({ type: [RankingEvaluationEntryDTO] })
  RankingEvaluationEntries: Array<RankingEvaluationEntryDTO>;

  static fromTabT(entry: MemberEntryResultEntry): MemberEntryResultEntryDTO {
    const dto = new MemberEntryResultEntryDTO();
    dto.Date = entry.Date;
    dto.UniqueIndex = entry.UniqueIndex;
    dto.FirstName = entry.FirstName;
    dto.LastName = entry.LastName;
    dto.Ranking = entry.Ranking;
    dto.Result = entry.Result;
    dto.SetFor = entry.SetFor;
    dto.SetAgainst = entry.SetAgainst;
    dto.CompetitionType = entry.CompetitionType;
    dto.Club = entry.Club;
    dto.MatchId = entry.MatchId;
    dto.MatchUniqueId = entry.MatchUniqueId;
    dto.TournamentName = entry.TournamentName;
    dto.TournamentSerieName = entry.TournamentSerieName;
    dto.TeamName = entry.TeamName;
    dto.RankingEvaluationCount = entry.RankingEvaluationCount;
    if (entry.RankingEvaluationEntries) {
      dto.RankingEvaluationEntries = entry.RankingEvaluationEntries.map(
        RankingEvaluationEntryDTO.fromTabT,
      );
    }
    return dto;
  }
}

export class MemberEntryDTO {
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
  @ApiPropertyOptional()
  Gender?: 'M' | 'F';

  @ApiPropertyOptional()
  Category?: string;
  /** http://api.frenoy.net/TabTAPI#xsd:date(undefined) */
  @ApiPropertyOptional()
  BirthDate?: string;

  @ApiPropertyOptional()
  MedicalAttestation?: boolean;

  @ApiPropertyOptional()
  RankingPointsCount?: number;
  
  @ApiPropertyOptional({ type: [RankingPointsEntryDTO] })
  RankingPointsEntries?: Array<RankingPointsEntryDTO>;

  @ApiPropertyOptional()
  Email?: string;
  
  @ApiPropertyOptional()
  Phone?: PhoneDTO;

  @ApiPropertyOptional()
  Address?: AddressDTO;

  @ApiPropertyOptional()
  ResultCount?: number;

  @ApiPropertyOptional({ type: [MemberEntryResultEntryDTO] })
  ResultEntries?: Array<MemberEntryResultEntryDTO>;

  @ApiPropertyOptional()
  NationalNumber?: string;

  static fromTabT(entry: MemberEntry): MemberEntryDTO {
    const dto = new MemberEntryDTO();
    dto.Position = entry.Position;
    dto.UniqueIndex = entry.UniqueIndex;
    dto.RankingIndex = entry.RankingIndex;
    dto.FirstName = entry.FirstName;
    dto.LastName = entry.LastName;
    dto.Ranking = entry.Ranking;
    dto.Status = entry.Status;
    dto.Club = entry.Club;
    dto.Gender = entry.Gender;
    dto.Category = entry.Category;
    dto.BirthDate = entry.BirthDate;
    dto.MedicalAttestation = entry.MedicalAttestation;
    dto.RankingPointsCount = entry.RankingPointsCount;
    dto.RankingPointsEntries = entry.RankingPointsEntries ? entry.RankingPointsEntries.map(RankingPointsEntryDTO.fromTabT) : undefined;
    dto.Email = entry.Email;
    dto.Phone = entry.Phone ? PhoneDTO.fromTabT(entry.Phone) : undefined;
    dto.Address = entry.Address ? AddressDTO.fromTabT(entry.Address) : undefined;
    dto.ResultCount = entry.ResultCount;
    dto.ResultEntries = entry.ResultEntries ? entry.ResultEntries.map(MemberEntryResultEntryDTO.fromTabT) : undefined;
    dto.NationalNumber = entry.NationalNumber;
    return dto;
  }
}

export class WeeklyELO {
  @ApiProperty()
  @IsNumber()
  weekName: string;

  @ApiProperty()
  @IsNumber()
  elo: number;
}

export class WeeklyNumericRanking {
  @ApiProperty()
  @IsNumber()
  weekName: string;

  @ApiProperty()
  @IsNumber()
  elo: number;

  @ApiProperty()
  @IsNumber()
  bel: number;
}

export class WeeklyNumericRankingV2 {
  @ApiProperty()
  @IsNumber()
  weekName: string;

  @ApiProperty()
  @IsNumber()
  bel: number;
}

export class WeeklyNumericPointsV3 {
  @ApiProperty()
  weekName: string;

  @ApiProperty()
  points: number;
}

export class WeeklyNumericPointsV5 {
  @ApiProperty()
  date: string;

  @ApiProperty()
  points: number;

  @ApiProperty()
  ranking: number;

  @ApiPropertyOptional()
  rankingLetterEstimation: string;
}

export class NumericRankingPerWeekOpponentsV3 {
  @ApiProperty()
  opponentName: string;

  @ApiProperty()
  opponentUniqueIndex: number;

  @ApiProperty()
  opponentRanking: string;

  @ApiProperty()
  opponentNumericRanking: number;

  @ApiProperty()
  pointsWon: number;

  @ApiProperty()
  score: string;
}

export enum COMPETITION_TYPE {
  CHAMPIONSHIP = 'championship',
  TOURNAMENT = 'tournament',
}

export class NumericRankingDetailsV3 {
  @ApiProperty()
  date: string;

  @ApiProperty({
    enum: COMPETITION_TYPE,
  })
  competitionType: COMPETITION_TYPE;

  @ApiProperty()
  competitionContext: string;

  @ApiProperty()
  basePoints: number;

  @ApiProperty()
  endPoints: number;

  @ApiProperty({
    type: [NumericRankingPerWeekOpponentsV3],
  })
  opponents: NumericRankingPerWeekOpponentsV3[];
}

export class WeeklyNumericRankingV3 {
  @ApiProperty({
    type: [WeeklyNumericPointsV3],
  })
  points: WeeklyNumericPointsV3[];

  @ApiProperty({
    type: [NumericRankingDetailsV3],
  })
  perDateHistory: NumericRankingDetailsV3[];

  @ApiProperty()
  actualPoints: number;
}

export type WeeklyNumericRankingV4 = WeeklyNumericRankingV3;

export class WeeklyNumericRankingV5 {
  @ApiProperty({
    type: [WeeklyNumericPointsV5],
  })
  numericRankingHistory: WeeklyNumericPointsV5[];

  @ApiProperty({
    type: [NumericRankingDetailsV3],
  })
  perDateHistory: NumericRankingDetailsV3[];
}


export enum PLAYER_CATEGORY_OLD {
  MEN = 'MEN',
  WOMEN = 'WOMEN',
  VETERANS = 'VETERANS',
  VETERANS_WOMEN = 'VETERANS_WOMEN',
  YOUTH = 'YOUTH',
}


export class WeeklyNumericRankingInput extends RequestBySeasonDto {
  @ApiPropertyOptional({ enum: PLAYER_CATEGORY_OLD })
  @IsEnum(PLAYER_CATEGORY_OLD)
  category?: PLAYER_CATEGORY_OLD;
}

export class WeeklyNumericRankingInputV2 {
  @ApiPropertyOptional({ enum: PLAYER_CATEGORY_OLD })
  @IsEnum(PLAYER_CATEGORY_OLD)
  category?: PLAYER_CATEGORY_OLD;
}

export type WeeklyNumericRankingInputV3 = WeeklyNumericRankingInputV2;

export class WeeklyNumericRankingInputV5 {
  // only allow MEN, WOMEN, VETERANS, VETERANS_WOMEN, YOUTH

  @ApiPropertyOptional({enum: PlayerCategoryDTO})
  @IsEnum(PlayerCategoryDTO)
  category?: PlayerCategoryDTO;
}

export class GetPlayerCategoriesInput {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform((id) => parseInt(id.value), { toClassOnly: true })
  uniqueIndex?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nameSearch?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shortNameSearch?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  rankingCategory?: string;
}

export class LookupDTO {
  @ApiProperty()
  @Matches(
    "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$",
    'u',
    { message: 'query can only contains letters' },
  )
  @MinLength(3)
  query: string;
}
