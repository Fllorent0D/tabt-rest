import {
  DivisionEntry,
  RankingEntry,
} from '../../../entity/tabt-soap/TabTAPI_Port';
import { WinLossSummaryDTOV1 } from './member-dashboard.dto';
import { ResponseDTO } from './common.dto';
import { ApiProperty } from '@nestjs/swagger';

export class DivisionMemberDashboardDTOV1 extends WinLossSummaryDTOV1 {
  member: {
    lastname: string;
    firstname: string;
    ranking: string;
    clubName: string;
  };
}

export class DivisionDashboardDTOV1 {
  @ApiProperty({ type: ResponseDTO })
  division: ResponseDTO<DivisionEntry>;

  @ApiProperty({ type: RankingEntry, isArray: true })
  ranking: ResponseDTO<RankingEntry[]>;

  @ApiProperty({ type: DivisionMemberDashboardDTOV1, isArray: true })
  playersStats: ResponseDTO<DivisionMemberDashboardDTOV1[]>;
}
