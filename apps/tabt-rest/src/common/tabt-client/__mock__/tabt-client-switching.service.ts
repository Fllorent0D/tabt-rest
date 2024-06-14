export class TabtClientSwitchingService {
  tabtClient = {
    TestAsync: jest.fn(),
    GetSeasonsAsync: jest.fn(),
    GetClubTeamsAsync: jest.fn(),
    GetDivisionRankingAsync: jest.fn(),
    GetMatchesAsync: jest.fn(),
    GetMembersAsync: jest.fn(),
    UploadAsync: jest.fn(),
    GetClubsAsync: jest.fn(),
    GetDivisionsAsync: jest.fn(),
    GetTournamentsAsync: jest.fn(),
    GetMatchSystemsAsync: jest.fn(),
    TournamentRegisterAsync: jest.fn(),
  };
}
