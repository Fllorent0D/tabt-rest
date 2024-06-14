import { MatchSystemEntry } from '../../../entity/tabt-soap/TabTAPI_Port';

export class MatchSystemService {
  data: MatchSystemEntry[] = [
    {
      UniqueIndex: 1,
      Name: 'Interclubs Provincial (<=2001)',
      SingleMatchCount: 4,
      DoubleMatchCount: 0,
      SetCount: 2,
      PointCount: 21,
      ForcedDoubleTeams: false,
      SubstituteCount: 0,
      TeamMatchCount: 16,
      TeamMatchDefinitionEntries: [
        {
          Position: 1,
          Type: 1,
          HomePlayerIndex: 4,
          AwayPlayerIndex: 2,
        },
      ],
    },
    {
      UniqueIndex: 2,
      Name: 'Interclubs Provincial',
      SingleMatchCount: 4,
      DoubleMatchCount: 0,
      SetCount: 3,
      PointCount: 11,
      ForcedDoubleTeams: false,
      SubstituteCount: 0,
      TeamMatchCount: 16,
      TeamMatchDefinitionEntries: [
        {
          Position: 1,
          Type: 1,
          HomePlayerIndex: 4,
          AwayPlayerIndex: 2,
        },
        {
          Position: 2,
          Type: 1,
          HomePlayerIndex: 3,
          AwayPlayerIndex: 1,
        },
        {
          Position: 3,
          Type: 1,
          HomePlayerIndex: 2,
          AwayPlayerIndex: 4,
        },
        {
          Position: 4,
          Type: 1,
          HomePlayerIndex: 1,
          AwayPlayerIndex: 3,
        },
        {
          Position: 5,
          Type: 1,
          HomePlayerIndex: 4,
          AwayPlayerIndex: 1,
        },
        {
          Position: 6,
          Type: 1,
          HomePlayerIndex: 3,
          AwayPlayerIndex: 2,
        },
      ],
    },
  ];

  async getMatchSystems(): Promise<MatchSystemEntry[]> {
    return Promise.resolve(this.data);
  }

  async getMatchSystemsById(id: number): Promise<MatchSystemEntry | null> {
    return Promise.resolve(this.data[0]);
  }
}
