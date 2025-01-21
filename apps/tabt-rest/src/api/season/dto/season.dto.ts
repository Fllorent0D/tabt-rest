import { ApiProperty } from '@nestjs/swagger';
import { SeasonEntry } from 'apps/tabt-rest/src/entity/tabt-soap/TabTAPI_Port';

export class SeasonDto {
  @ApiProperty({
    description: 'The unique identifier of the season',
    example: 23,
  })
  season: number;

  @ApiProperty({
    description: 'The name of the season',
    example: '2023-2024',
  })
  name: string;

  @ApiProperty({
    description: 'Whether this is the current season',
    example: true,
  })
  isCurrent: boolean;

  static fromTabT(season: SeasonEntry): SeasonDto {
    return {
      season: season.Season,
      name: season.Name,
      isCurrent: season.IsCurrent,
    };
  }
}
