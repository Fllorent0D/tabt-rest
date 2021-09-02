import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetTournaments {
}

export class GetTournamentDetails {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform((a) => Boolean(a))
  withResults?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform((a) => Boolean(a))
  withRegistrations? : boolean;
}

export class RegisterTournament {
  @ApiProperty()
  @IsNumber({},{each: true})
  playerUniqueIndex: Array<number>;

  @ApiProperty()
  @IsBoolean()
  @Transform((a) => Boolean(a))
  unregister: boolean;

  @ApiProperty()
  @IsBoolean()
  @Transform((a) => Boolean(a))
  notifyPlayer: boolean;
}
