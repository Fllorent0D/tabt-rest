import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsEnum, IsIn, IsInt, IsNumber, IsOptional } from 'class-validator';
import { RequestBySeasonDto } from '../../../common/dto/request-by-season.dto';
import { Transform } from 'class-transformer';
import { GetMatches } from '../../match/dto/match.dto';
import { Level } from '../../../entity/tabt-input.interface';

export class GetDivisions extends RequestBySeasonDto {
  @ApiPropertyOptional({ enum: Level })
  @IsOptional()
  @IsEnum(Level)
  level?: string;

  @ApiPropertyOptional({ enum: ['no', 'yes', 'short'] })
  @IsOptional()
  @IsIn(['no', 'yes', 'short'])
  showDivisionName?: 'no' | 'yes' | 'short';
}

export class GetDivisionRanking {
  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  weekName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  rankingSystem?: number;
}

export class GetDivisionMatches extends PickType(GetMatches, ['weekName', 'yearDateFrom', 'yearDateTo', 'withDetails']) {

}
