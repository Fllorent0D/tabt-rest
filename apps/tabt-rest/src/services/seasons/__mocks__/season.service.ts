import { GetSeasonsInput, SeasonEntry } from '../../../entity/tabt-soap/TabTAPI_Port';

export class SeasonService {
  data: SeasonEntry[] = [
    {
      Season: 20,
      Name: '2019-2020',
      IsCurrent: false,
    },
    {
      Season: 21,
      Name: '2020-2021',
      IsCurrent: true,
    },
  ];

  async getSeasons(input: GetSeasonsInput = {}): Promise<SeasonEntry[]> {
    return Promise.resolve(this.data);
  }

  async getCurrentSeason(input: GetSeasonsInput = {}): Promise<SeasonEntry> {
    return Promise.resolve(this.data[0]);
  }
}
