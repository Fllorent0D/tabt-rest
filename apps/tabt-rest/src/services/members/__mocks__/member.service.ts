import { GetMembersInput, MemberEntry } from '../../../entity/tabt-soap/TabTAPI_Port';

export class MemberService {
  async getMembers(input: GetMembersInput): Promise<MemberEntry[]> {
    return Promise.resolve([
      {
        Position: 1,
        UniqueIndex: 142453,
        RankingIndex: 0,
        FirstName: 'FLORENT',
        LastName: 'CARDOEN',
        Ranking: 'D2',
        Status: 'A',
        Club: 'N051',
      },
    ]);
  }
}
