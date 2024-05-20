import { ApiProperty } from '@nestjs/swagger';
import { ClubEntry, MemberEntry, TeamEntry, TeamMatchesEntry } from '../../../entity/tabt-soap/TabTAPI_Port';
import { ResponseDTO } from './common.dto';

export class ClubDashboardDTOV1 {
  @ApiProperty({ type: ClubEntry})
  club: ResponseDTO<ClubEntry>;
  @ApiProperty({type: MemberEntry, isArray: true})
  members: ResponseDTO<MemberEntry[]>;
  @ApiProperty({type: TeamEntry, isArray: true})
  teams: ResponseDTO<TeamEntry[]>;
  @ApiProperty({type: 'object', additionalProperties: {type: 'array', additionalProperties: {type: '#/components/TeamMatchEntry'}} , description: 'key is the week name'})
  matches: ResponseDTO<{
    [weekName: number]: TeamMatchesEntry[]
  }>
}
