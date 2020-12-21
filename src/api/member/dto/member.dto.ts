import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { GetMembersInput } from '../../../entity/tabt-soap/TabTAPI_Port';
import { RequestBySeasonDto } from '../../../common/dto/request-by-season.dto';
import { PlayerCategory, TabtInputInterface } from '../../../entity/tabt-input.interface';

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
  uniqueIndex?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nameSearch?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  extendedInformation?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  rankingPointsInformation?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  withResults?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  withOpponentRankingEvaluation?: boolean;

}

export class GetMember extends OmitType(GetMembers, ['uniqueIndex']) {
}
