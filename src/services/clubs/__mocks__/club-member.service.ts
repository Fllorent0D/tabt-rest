import { MemberEntry } from '../../../entity/tabt-soap/TabTAPI_Port';

export class ClubMemberService {

  async getClubsMembers(): Promise<MemberEntry[]> {
    return Promise.resolve([{
        Position: 1,
        UniqueIndex: 120506,
        RankingIndex: 1,
        FirstName: 'DIDIER',
        LastName: 'GUSTIN',
        Ranking: 'D4',
        Status: 'A',
        Club: 'L360',
      },
        {
          Position: 2,
          Club: 'L360',
          UniqueIndex: 120502,
          RankingIndex: 2,
          FirstName: 'ALFRED',
          LastName: 'DORTU',
          Ranking: 'D6',
          Status: 'A',
        }],
    );
  }
}
