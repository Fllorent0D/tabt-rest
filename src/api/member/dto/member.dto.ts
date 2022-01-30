import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PlayerCategory } from '../../../entity/tabt-input.interface';
import { RequestBySeasonDto } from '../../../common/dto/request-by-season.dto';

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
  @Transform((a) => Boolean(a.value))
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
  elo: number;

  @ApiProperty()
  @IsNumber()
  belPts: number;

  @ApiProperty()
  @IsNumber()
  belPos: number;
}

export class WeeklyNumericRankingInput extends RequestBySeasonDto {
  @ApiPropertyOptional({ enum: PlayerCategory })
  @IsEnum(PlayerCategory)
  category?: PlayerCategory;
}
