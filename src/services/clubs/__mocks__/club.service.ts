import { ClubEntry, GetClubsInput } from '../../../entity/tabt-soap/TabTAPI_Port';

export class ClubService {
  private clubs: ClubEntry[] = [{
    UniqueIndex: 'A000',
    Name: 'Individueel',
    LongName: 'Individueel Antwerpen',
    Category: 4,
    CategoryName: 'Antwerpen',
    VenueCount: 0,
  },
    {
      UniqueIndex: 'A003',
      Name: 'Salamander',
      LongName: 'KTTC Salamander Mechelen',
      Category: 4,
      CategoryName: 'Antwerpen',
      VenueCount: 1,
    },
  ];

  async getClubs(input: GetClubsInput): Promise<ClubEntry[]> {
    return Promise.resolve(this.clubs);
  }

  async getClubById(input: GetClubsInput, uniqueIndex: string): Promise<ClubEntry> {
    return Promise.resolve(this.clubs[0]);
  }
}
