import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RequestBySeasonDto } from '../../../common/dto/request-by-season.dto';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class GetTournaments extends RequestBySeasonDto {
}

export class GetTournamentDetails {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  withResults?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  withRegistrations? : boolean;
}

export class RegisterTournament {
  @ApiProperty()
  @IsNumber({},{each: true})
  playerUniqueIndex: Array<number>;

  @ApiProperty()
  @IsBoolean()
  unregister: boolean;

  @ApiProperty()
  @IsBoolean()
  notifyPlayer: boolean;
}
