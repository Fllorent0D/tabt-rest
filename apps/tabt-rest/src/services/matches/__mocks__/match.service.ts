import { GetMatchesInput, TeamMatchesEntry } from '../../../entity/tabt-soap/TabTAPI_Port';

export class MatchService {
  async getMatches(input: GetMatchesInput): Promise<TeamMatchesEntry[]> {
    return Promise.resolve([
      {
        MatchId: 'SH01/001',
        WeekName: '01',
        Date: '2020-09-20T00:00:00.000Z',
        Time: '17:00:00',
        Venue: 1,
        VenueClub: 'A176',
        VenueEntry: {
          Name: 'TTC Sokah',
          Street: 'Albert Einsteinlaan, 50',
          Town: '2660 Hoboken',
          Phone: '03/830.21.71',
          Comment: 'Sokah ligt vlak over het crematorium van Wilrijk',
        },
        HomeClub: 'A176',
        HomeTeam: 'Sokah',
        AwayClub: 'L264',
        AwayTeam: 'Tiege',
        Score: '5-1',
        MatchUniqueId: 463141,
        NextWeekName: '02',
        IsHomeForfeited: false,
        IsAwayForfeited: false,
        DivisionId: 4755,
        DivisionCategory: 1,
        IsHomeWithdrawn: true,
        IsAwayWithdrawn: false,
        IsValidated: true,
        IsLocked: true,
      },
      {
        MatchId: 'SH01/002',
        WeekName: '01',
        Date: '2020-09-17T00:00:00.000Z',
        Time: '20:00:00',
        Venue: 1,
        VenueClub: 'BBW165',
        VenueEntry: {
          Name: "CENTRE SPORTIF D'AUDERGHEM",
          Street: 'CHAUSSEE DE WAVRE 1690',
          Town: '1160 BRUXELLES',
          Phone: '02/672.24.21',
          Comment: '',
        },
        HomeClub: 'BBW165',
        HomeTeam: 'Logis Auderghem',
        AwayClub: 'H009',
        AwayTeam: 'Castellinoise',
        Score: '2-4',
        MatchUniqueId: 459895,
        NextWeekName: '02',
        IsHomeForfeited: false,
        IsAwayForfeited: false,
        DivisionId: 4755,
        DivisionCategory: 1,
        IsHomeWithdrawn: true,
        IsAwayWithdrawn: false,
        IsValidated: true,
        IsLocked: true,
      },
    ]);
  }
}
