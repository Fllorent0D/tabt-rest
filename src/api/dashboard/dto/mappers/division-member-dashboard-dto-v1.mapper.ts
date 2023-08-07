import { DivisionMemberDashboardDTOV1 } from '../division-dashboard.dto';
import { MemberResults } from '../../../../common/dto/member-ranking.dto';

export class DivisionMemberDashboardDTOV1Mapper {
  static mapMemberResults(memberResult: MemberResults): DivisionMemberDashboardDTOV1{
    return {
      member:{
        lastname: memberResult.lastName,
        firstname: memberResult.firstName,
        ranking: memberResult.ranking,
        clubName: ''
      },
      count: memberResult.played,
      victories: memberResult.win,
      defeats: memberResult.lose,
      victoriesPct: memberResult.winPourcentage,
      defeatsPct: memberResult.losePourcentage,
    }
  }
}
