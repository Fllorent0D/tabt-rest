import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { RequestBySeasonDto } from '../../../common/dto/request-by-season.dto';
import { PlayerCategory } from '../../../entity/tabt-input.interface';

export class GetMembers extends RequestBySeasonDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  club?: string;

  @ApiPropertyOptional({enum: PlayerCategory})
  @IsOptional()
  @IsEnum(PlayerCategory)
  playerCategory?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(id => parseInt(id), { toClassOnly: true })
  uniqueIndex?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nameSearch?: string;

  @ApiPropertyOptional()
  @Transform((a) => Boolean(a))
  @IsBoolean()
  @IsOptional()
  extendedInformation?: boolean;

  @ApiPropertyOptional()
  @Transform((a) => Boolean(a))
  @IsBoolean()
  @IsOptional()
  rankingPointsInformation?: boolean;

  @ApiPropertyOptional()
  @Transform((a) => Boolean(a))
  @IsBoolean()
  @IsOptional()
  withResults: boolean;

  @ApiPropertyOptional()
  @Transform((a) => Boolean(a))
  @IsBoolean()
  @IsOptional()
  withOpponentRankingEvaluation?: boolean;

}

export class GetMember extends OmitType(GetMembers, ['uniqueIndex']) {
}
