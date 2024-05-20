import { MemberResults } from '../../../common/dto/member-ranking.dto';

export class MatchesMembersRankerService {
  data = [
    {
      'uniqueIndex': 142101,
      'firstName': 'MORGANE',
      'lastName': 'GUIDON',
      'ranking': 'B4',
      'played': 22,
      'win': 13,
      'lose': 9,
      'winPourcentage': 59,
      'losePourcentage': 41,
    },
    {
      'uniqueIndex': 143584,
      'firstName': 'GABRIEL',
      'lastName': 'STANESCU',
      'ranking': 'B0',
      'played': 16,
      'win': 7,
      'lose': 9,
      'winPourcentage': 44,
      'losePourcentage': 56,
    },
    {
      'uniqueIndex': 100577,
      'firstName': 'FRANCOIS',
      'lastName': 'GOBEAUX',
      'ranking': 'B0',
      'played': 15,
      'win': 11,
      'lose': 4,
      'winPourcentage': 73,
      'losePourcentage': 27,
    },
    {
      'uniqueIndex': 103945,
      'firstName': 'CAROLINE',
      'lastName': 'DELFORGE',
      'ranking': 'C6',
      'played': 14,
      'win': 6,
      'lose': 8,
      'winPourcentage': 43,
      'losePourcentage': 57,
    },
    {
      'uniqueIndex': 107768,
      'firstName': 'VIRGINIE',
      'lastName': 'DIEUDONNE',
      'ranking': 'E4',
      'played': 13,
      'win': 7,
      'lose': 6,
      'winPourcentage': 54,
      'losePourcentage': 46,
    },
  ];

  async getMembersRankingFromDivision(divisionId: number, season: number): Promise<MemberResults[]> {
    return Promise.resolve(this.data);
  }

  async getMembersRankingFromClub(club: string, season: number): Promise<MemberResults[]> {
    return Promise.resolve(this.data);
  }

  async getMembersRankingFromTeam(club: string, teamId: string, season: number): Promise<MemberResults[]> {
    return Promise.resolve(this.data);
  }


}
