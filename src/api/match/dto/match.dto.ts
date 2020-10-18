import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { RequestBySeason } from '../../../common/dto/RequestBySeason';
import { Level, PlayerCategory } from '../../../entity/tabt-input.interface';

export class GetMatches extends RequestBySeason{
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Transform(id => parseInt(id), { toClassOnly: true })
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
    enum: PlayerCategory
  })
  @IsEnum(PlayerCategory)
  @IsOptional()
  divisionCategory?: PlayerCategory;

  @ApiPropertyOptional({
    type: IsNumber
  })
  @IsNumber()
  weekName: string;

  @ApiPropertyOptional({
    enum: Level
  })
  @IsEnum(Level)
  @IsOptional()
  level?: Level;

  @ApiPropertyOptional()
  @IsEnum(['no', 'yes', 'short'])
  @IsOptional()
  showDivisionName?: 'no' | 'yes' | 'short';

  @ApiPropertyOptional({
    description: 'YYYY-MM-DD'
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/i)
  yearDateFrom?: string;

  @ApiPropertyOptional({
    description: 'YYYY-MM-DD'
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/i)
  yearDateTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform((val) => Boolean(val), {toClassOnly: true})
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
