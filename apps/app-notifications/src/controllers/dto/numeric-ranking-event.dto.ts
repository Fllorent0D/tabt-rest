import { IsNumber } from 'class-validator';

export class NumericRankingEventDto {
  @IsNumber()
  uniqueIndex: number;
  @IsNumber()
  oldRanking: number;
  @IsNumber()
  newRanking: number;
}
