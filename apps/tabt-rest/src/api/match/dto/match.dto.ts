import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Level, PlayerCategory } from '../../../entity/tabt-input.interface';

export class GetMatches {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Transform((id) => parseInt(id.value), { toClassOnly: true })
  divisionId?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  club?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  team?: string;

  @ApiPropertyOptional({
    enum: PlayerCategory,
  })
  @IsEnum(PlayerCategory)
  @IsOptional()
  divisionCategory?: string;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Transform((id) => parseInt(id.value), { toClassOnly: true })
  weekName?: string;

  @ApiPropertyOptional({
    enum: Level,
  })
  @IsEnum(Level)
  @IsOptional()
  level?: string;

  @ApiPropertyOptional()
  @IsEnum(['no', 'yes', 'short'])
  @IsOptional()
  showDivisionName?: 'no' | 'yes' | 'short';

  @ApiPropertyOptional({
    description: 'YYYY-MM-DD',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/i)
  yearDateFrom?: string;

  @ApiPropertyOptional({
    description: 'YYYY-MM-DD',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/i)
  yearDateTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform((val) => Boolean(val.value), { toClassOnly: true })
  @IsBoolean()
  withDetails?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  matchId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  matchUniqueId?: string;
}

export class GetMatch extends OmitType(GetMatches, [
  'matchUniqueId',
] as const) {}
