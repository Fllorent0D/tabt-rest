import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsEnum, IsIn, IsInt, IsNumber, IsOptional } from 'class-validator';
import { RequestBySeason } from '../../../common/dto/RequestBySeason';
import { Transform } from 'class-transformer';
import { GetMatches } from '../../match/dto/match.dto';
import { Level } from '../../../entity/tabt-input.interface';

export class ListAllDivisions extends RequestBySeason {
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
    type: IsNumber,
  })
  @Transform(id => parseInt(id), { toClassOnly: true })
  @IsOptional()
  @IsNumber()
  week?: string;

  @ApiPropertyOptional()
  @Transform(id => parseInt(id), { toClassOnly: true })
  @IsOptional()
  @IsInt()
  rankingSystem?: number;
}

export class GetDivisionMatches extends PickType(GetMatches, ['weekName', 'yearDateFrom', 'yearDateTo', 'withDetails']) {

}
