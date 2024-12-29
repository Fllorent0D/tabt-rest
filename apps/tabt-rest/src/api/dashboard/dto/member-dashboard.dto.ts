import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  MemberEntry,
  MemberEntryResultEntry,
  TeamMatchesEntry,
} from '../../../entity/tabt-soap/TabTAPI_Port';
import {
  WeeklyNumericRankingV3,
  WeeklyNumericRankingV4,
  WeeklyNumericRankingV5,
} from '../../member/dto/member.dto';
import { IsEnum } from 'class-validator';
import { ResponseDTO } from './common.dto';
import { PlayerCategoryDTO } from 'apps/tabt-rest/src/common/dto/player-category.dto';

export class WinLossSummaryDTOV1 {
  @ApiProperty({ type: Number })
  count: number;

  @ApiPropertyOptional({ type: Number })
  victories?: number;
  @ApiPropertyOptional({ type: Number })
  defeats?: number;
  @ApiPropertyOptional({ type: Number })
  victoriesPct?: number;
  @ApiPropertyOptional({ type: Number })
  defeatsPct?: number;
}

export class RankingWinLossDTOV1 extends WinLossSummaryDTOV1 {
  @ApiProperty()
  ranking: string;
  @ApiProperty({ type: MemberEntryResultEntry, isArray: true })
  players: MemberEntryResultEntry[];
}

export class WeeklyNumericRankingInputV2 {
  @ApiPropertyOptional({ enum: PlayerCategoryDTO })
  @IsEnum(PlayerCategoryDTO)
  category?: PlayerCategoryDTO;
}

export class MemberStatsDTOV1 {
  @ApiProperty({ type: WinLossSummaryDTOV1 })
  tieBreaks: WinLossSummaryDTOV1;
  @ApiProperty({ type: WinLossSummaryDTOV1 })
  matches: WinLossSummaryDTOV1;
  @ApiProperty({ type: RankingWinLossDTOV1, isArray: true })
  perRanking: RankingWinLossDTOV1[];
}

export class MemberDashboardDTOV1 {
  @ApiProperty({
    type: () => ResponseDTO,
    description: 'The status of the response',
  })
  public status: ResponseDTO<string>;

  @ApiProperty({ type: () => MemberEntry, description: 'The member data' })
  public member: MemberEntry;

  @ApiProperty({
    type: () => WeeklyNumericRankingV5,
    description: 'The numeric ranking response',
  })
  public numericRanking: WeeklyNumericRankingV5;

  @ApiProperty({
    type: () => [TeamMatchesEntry],
    description: 'The latest team matches',
  })
  public latestTeamMatches: TeamMatchesEntry[];

  @ApiProperty({
    type: () => MemberStatsDTOV1,
    description: 'The statistics of the member',
  })
  public stats: MemberStatsDTOV1;

  constructor(status: ResponseDTO<string>) {
    this.status = status;
  }
}
