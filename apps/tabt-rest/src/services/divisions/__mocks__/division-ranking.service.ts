import { GetDivisionRankingInput, RankingEntry } from '../../../entity/tabt-soap/TabTAPI_Port';

export class DivisionRankingService {
  async getDivisionRanking(
    input: GetDivisionRankingInput,
  ): Promise<RankingEntry[]> {
    return Promise.resolve([
      {
        Position: 1,
        Team: 'Palette Patria Castellinoise',
        GamesPlayed: 2,
        GamesWon: 2,
        GamesLost: 0,
        GamesDraw: 0,
        GamesWO: 0,
        IndividualMatchesWon: 9,
        IndividualMatchesLost: 3,
        IndividualSetsWon: 30,
        IndividualSetsLost: 13,
        Points: 6,
        TeamClub: 'H009',
      },
      {
        Position: 2,
        Team: 'TTC Sokah Hoboken',
        GamesPlayed: 2,
        GamesWon: 1,
        GamesLost: 0,
        GamesDraw: 1,
        GamesWO: 0,
        IndividualMatchesWon: 8,
        IndividualMatchesLost: 4,
        IndividualSetsWon: 26,
        IndividualSetsLost: 15,
        Points: 5,
        TeamClub: 'A176',
      },
    ]);
  }
}
