import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsEnum, IsIn, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { GetMatches } from '../../match/dto/match.dto';
import { Level } from '../../../entity/tabt-input.interface';

export class GetDivisions {
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
  @Transform(id => parseInt(id), { toClassOnly: true })
  @IsOptional()
  @IsNumber()
  weekName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  rankingSystem?: number;
}

export class GetDivisionMatches extends PickType(GetMatches, ['weekName', 'yearDateFrom', 'yearDateTo', 'withDetails']) {

}
