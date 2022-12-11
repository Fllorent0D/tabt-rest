import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Allow, IsBoolean, IsEnum, IsIn, IsNumber, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { PlayerCategory } from '../../../entity/tabt-input.interface';
import { RequestBySeasonDto } from '../../../common/dto/request-by-season.dto';
import { MemberEntry } from '../../../entity/tabt-soap/TabTAPI_Port';

export class GetMembers {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  club?: string;

  @ApiPropertyOptional({ enum: PlayerCategory })
  @IsOptional()
  @IsEnum(PlayerCategory)
  playerCategory?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(id => parseInt(id.value), { toClassOnly: true })
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

export class GetMember extends OmitType(GetMembers, ['uniqueIndex']) {
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

export enum PLAYER_CATEGORY {
  MEN = 'MEN',
  WOMEN = 'WOMEN',
  VETERANS = 'VETERANS',
  VETERANS_WOMEN = 'VETERANS_WOMEN',
  YOUTH = 'YOUTH',
}

export class MemberEntries {
  @ApiProperty()
  [PLAYER_CATEGORY.MEN]: MemberEntry;

  @ApiProperty()
  [PLAYER_CATEGORY.WOMEN]: MemberEntry;

  @ApiProperty()
  [PLAYER_CATEGORY.VETERANS]: MemberEntry;

  @ApiProperty()
  [PLAYER_CATEGORY.VETERANS_WOMEN]: MemberEntry;

  @ApiProperty()
  [PLAYER_CATEGORY.YOUTH]: MemberEntry;
}

export class WeeklyNumericRankingInput extends RequestBySeasonDto {
  @ApiPropertyOptional({ enum: PlayerCategory })
  @IsEnum(PlayerCategory)
  category?: PlayerCategory;
}

export class WeeklyNumericRankingInputV2 {
  @ApiPropertyOptional({ enum: PlayerCategory})
  @IsEnum(PlayerCategory)
  category?: PlayerCategory;
}

export class GetPlayerCategoriesInput {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(id => parseInt(id.value), { toClassOnly: true })
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
  @Matches('^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.\'-]+$', 'u', { message: 'query can only contains letters' })
  @MinLength(3)
  query: string;
}
