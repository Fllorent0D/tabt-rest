import { DivisionMemberDashboardDTOV1 } from '../division-dashboard.dto';
import { PlayerMatchStats } from '../../../../services/matches/matches-members-ranker.service';
export class DivisionMemberDashboardDTOV1Mapper {
  static mapMemberResults(
    memberResult: PlayerMatchStats,
  ): DivisionMemberDashboardDTOV1 {
    return {
      member: {
        lastname: memberResult.lastName,
        firstname: memberResult.firstName,
        ranking: memberResult.ranking,
        clubName: '',
      },
      count: memberResult.played,
      victories: memberResult.win,
      defeats: memberResult.lose,
      victoriesPct: memberResult.winPourcentage,
      defeatsPct: memberResult.losePourcentage,
    };
  }
}
