import {
  GetTournamentsInput,
  TournamentEntry,
  TournamentRegisterInput,
  TournamentRegisterOutput,
} from '../../../entity/tabt-soap/TabTAPI_Port';


export class TournamentService {

  data: TournamentEntry[] = [{
    UniqueIndex: 3649,
    Name: 'B-Criterium Sokah',
    Level: 8,
    ExternalIndex: 'PANT-2021-HL-01',
    DateFrom: '2020-09-05T00:00:00.000Z',
    DateTo: '2020-09-06T00:00:00.000Z',
    RegistrationDate: '2020-09-01T00:00:00.000Z',
    Venue: {
      Name: 'Sokah',
      Street: 'A Einsteinlaan 50',
      Town: '2660 Hoboken',
    },
    SerieCount: 17,
    SerieEntries: [
      {
        UniqueIndex: 36459,
        Name: 'D OPEN',
      },
      {
        UniqueIndex: 37303,
        Name: 'D4-E6 Eindfase',
      },
    ],
  },
    {
      UniqueIndex: 3651,
      Name: 'B tornooi TTC Merelbeke (geannuleerd)',
      Level: 7,
      ExternalIndex: 'OVL-2021-BN-201',
      DateFrom: '2020-08-22T00:00:00.000Z',
      DateTo: '2020-08-23T00:00:00.000Z',
      RegistrationDate: '2020-07-26T00:00:00.000Z',
      Venue: {
        Name: 'Sporthal Ter Wallen',
        Street: 'Sportstraat 1',
        Town: '9820 Merelbeke',
      },
      SerieCount: 14,
      SerieEntries: [
        {
          UniqueIndex: 36485,
          Name: 'Recreant (poule)',
        },
      ],
    }];

  async getTournaments(input: GetTournamentsInput): Promise<TournamentEntry[]> {
    return Promise.resolve(this.data);
  }

  async registerToTournament(input: TournamentRegisterInput): Promise<TournamentRegisterOutput> {

    return Promise.resolve({ Success: true, MessageCount: 0, MessageEntries: [] });
  }
}
