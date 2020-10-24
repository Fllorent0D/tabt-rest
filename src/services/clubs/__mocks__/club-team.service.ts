import { TeamEntry } from '../../../entity/tabt-soap/TabTAPI_Port';

export class ClubTeamService {

  async getClubsTeams(): Promise<TeamEntry[]> {
    return Promise.resolve([{
      TeamId: '5122-8',
      Team: 'A',
      DivisionId: 5122,
      DivisionName: 'Division 6L - Prov. Liège - Hommes',
      DivisionCategory: 1,
      MatchType: 2,
    }, {
      TeamId: '5122-9',
      Team: 'B',
      DivisionId: 5122,
      DivisionName: 'Division 6L - Prov. Liège - Hommes',
      DivisionCategory: 1,
      MatchType: 2,
    }]);
  }
}
