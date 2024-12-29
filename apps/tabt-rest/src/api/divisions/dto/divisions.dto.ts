import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Level, PlayerCategory } from '../../../entity/tabt-input.interface';
import { Transform } from 'class-transformer';
import { LevelDTO, mapLevelToLevelDTO } from 'apps/tabt-rest/src/common/dto/levels.dto';
import { mapPlayerCategoryToPlayerCategoryDTO, PlayerCategoryDTO } from 'apps/tabt-rest/src/common/dto/player-category.dto';
import { DivisionCategoryDTO, mapDivisionCategoryToDivisionCategoryDTO } from 'apps/tabt-rest/src/common/dto/division-category.dto';
import { DivisionEntry } from 'apps/tabt-rest/src/entity/tabt-soap/TabTAPI_Port';

// Base DTO with common properties
export class GetDivisionsBase {
  @ApiPropertyOptional({
    enum: ['no', 'yes', 'short'],
    description: 'How to show division names',
  })
  @IsOptional()
  @IsEnum(['no', 'yes', 'short'])
  showDivisionName?: 'no' | 'yes' | 'short';
}

// V1 DTO - accepts numeric level
export class GetDivisionsV1 extends GetDivisionsBase {
  @ApiPropertyOptional({
    type: 'number',
    description: 'Filter divisions by level',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  level?: number;
}

// V2 DTO - accepts enum string level
export class GetDivisionsV2 extends GetDivisionsBase {
  @ApiPropertyOptional({
    enum: LevelDTO,
    description: 'Filter divisions by level category',
    example: 'NATIONAL'
  })
  @IsOptional()
  @IsEnum(LevelDTO)
  level?: keyof typeof LevelDTO;

  @ApiPropertyOptional({
    enum: DivisionCategoryDTO,
    description: 'Filter divisions by division category',
  })
  @IsOptional()
  @IsEnum(DivisionCategoryDTO)
  divisionCategory?: DivisionCategoryDTO;
}


export class DivisionEntryDto {
  @ApiProperty()
  DivisionId: number;

  @ApiPropertyOptional()
  DivisionName: string;

  @ApiProperty({ enum: LevelDTO })
  Level:  LevelDTO;

  @ApiProperty()
  MatchType: number;

  @ApiProperty({ enum: DivisionCategoryDTO })
  DivisionCategory: DivisionCategoryDTO;

  @ApiProperty({ enum: PlayerCategoryDTO })
  PlayerCategory: PlayerCategoryDTO;

// factory method
  static fromDivisionEntry(divisionEntry: DivisionEntry): DivisionEntryDto {
    return {
      ...divisionEntry,
      DivisionCategory: mapDivisionCategoryToDivisionCategoryDTO(divisionEntry.DivisionCategory),
      Level: mapLevelToLevelDTO(divisionEntry.Level),
      PlayerCategory: mapPlayerCategoryToPlayerCategoryDTO(divisionEntry.PlayerCategory),
    };
  }
} 

export class GetDivisionMatches {
  @ApiPropertyOptional()
  weekName: string;

  @ApiPropertyOptional()
  yearDateFrom: string;

  @ApiPropertyOptional()
  yearDateTo: string;

  @ApiPropertyOptional()
  withDetails: boolean;
}

export class GetDivisionRanking {

  @ApiPropertyOptional()
  rankingSystem?: number;

  @ApiPropertyOptional()
  weekName?: string;
}