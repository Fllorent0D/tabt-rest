import { IsNumber, IsString } from 'class-validator';

export class TeamMatchEventDTO {
  @IsString()
  MatchId: string;

  @IsNumber()
  WeekName: number;
}
