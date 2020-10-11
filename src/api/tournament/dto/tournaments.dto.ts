import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetTournamentsDTO {
  @ApiPropertyOptional()
  Season: number;
}

export class GetTournamentDTO {
  @ApiPropertyOptional()
  WithResults?: boolean;

  @ApiPropertyOptional()
  WithRegistrations? : boolean;
}

export class RegisterTournamentDTO {
  @ApiProperty()
  PlayerUniqueIndex: Array<number>;

  @ApiProperty()
  Unregister: boolean;

  @ApiProperty()
  NotifyPlayer: boolean;
}
