import { ApiPropertyOptional } from '@nestjs/swagger';
import { MemberEntry, MemberEntryResultEntry, TeamMatchesEntry } from '../../../entity/tabt-soap/TabTAPI_Port';
import { PLAYER_CATEGORY, WeeklyNumericRankingV3 } from '../../member/dto/member.dto';
import { IsEnum } from 'class-validator';
import { ResponseDTO } from './common.dto';


export class MemberDashboardDTOV1 {
  constructor(
    public member: ResponseDTO<MemberEntry>,
    public numericRankingResponse: ResponseDTO<WeeklyNumericRankingV3>,
    public latestTeamMatches: ResponseDTO<TeamMatchesEntry[]>,
    public stats: ResponseDTO<MemberStatsDTOV1>,
  ) {
  }
}

export class MemberStatsDTOV1 {
  tieBreaks: WinLossSummaryDTOV1;
  matches: WinLossSummaryDTOV1;
  perRanking: RankingWinLossDTOV1[];
}

export class WinLossSummaryDTOV1 {
  count: number;
  victories?: number;
  defeats?: number;
  victoriesPct?: number;
  defeatsPct?: number;
}

export class RankingWinLossDTOV1 extends WinLossSummaryDTOV1 {
  ranking: string;
  players: MemberEntryResultEntry[]
}

export class WeeklyNumericRankingInputV2 {
  @ApiPropertyOptional({ enum: PLAYER_CATEGORY})
  @IsEnum(PLAYER_CATEGORY)
  category?: PLAYER_CATEGORY;
}
