import {
  DivisionEntry,
  RankingEntry,
} from '../../../entity/tabt-soap/TabTAPI_Port';
import { WinLossSummaryDTOV1 } from './member-dashboard.dto';
import { ResponseDTO } from './common.dto';

export class DivisionMemberDashboardDTOV1 extends WinLossSummaryDTOV1 {
  member: {
    lastname: string;
    firstname: string;
    ranking: string;
    clubName: string;
  };
}

export class DivisionDashboardDTOV1 {
  division: ResponseDTO<DivisionEntry>;
  ranking: ResponseDTO<RankingEntry[]>;
  playersStats: ResponseDTO<DivisionMemberDashboardDTOV1[]>;
}
