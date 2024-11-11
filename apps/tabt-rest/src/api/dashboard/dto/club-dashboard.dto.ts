import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ClubEntry,
  MemberEntry,
  TeamEntry,
  TeamMatchesEntry,
} from '../../../entity/tabt-soap/TabTAPI_Port';
import { ResponseDTO } from './common.dto';

export class WeeklyTeamMatchEntryDTOV1 {
  @ApiProperty({ type: TeamMatchesEntry, isArray: true })
  matches: Array<TeamMatchesEntry>;

  @ApiProperty({ type: Number })
  weekname: number;
}

export class ListOfStrengthDTOV1 {
  @ApiPropertyOptional({ type: MemberEntry, isArray: true })
  men?: MemberEntry[];
  @ApiPropertyOptional({ type: MemberEntry, isArray: true })
  women?: MemberEntry[];
}

export class ClubDashboardDTOV1 {
  @ApiProperty({ type: ResponseDTO<string> })
  status: ResponseDTO<string>;

  @ApiPropertyOptional({ type: ClubEntry })
  club?: ClubEntry;
  @ApiPropertyOptional({ type: ListOfStrengthDTOV1 })
  listOfStrength?: ListOfStrengthDTOV1;
  @ApiPropertyOptional({ type: TeamEntry, isArray: true })
  teams?: TeamEntry[];
  @ApiPropertyOptional({
    type: TeamMatchesEntry,
    isArray: true,
  })
  matches?: TeamMatchesEntry[];
}
