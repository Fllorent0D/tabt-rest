import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetTournamentDetails {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform((a) => Boolean(a.value))
  withResults?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform((a) => Boolean(a.value))
  withRegistrations?: boolean;
}

export class RegisterTournament {
  @ApiProperty()
  @IsNumber({}, { each: true })
  playerUniqueIndex: Array<number>;

  @ApiProperty()
  @IsBoolean()
  @Transform((a) => Boolean(a.value))
  unregister: boolean;

  @ApiProperty()
  @IsBoolean()
  @Transform((a) => Boolean(a.value))
  notifyPlayer: boolean;
}
