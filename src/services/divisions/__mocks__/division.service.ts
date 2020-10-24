import { DivisionEntry, GetDivisionsInput } from '../../../entity/tabt-soap/TabTAPI_Port';

export class DivisionService {

  divisions: DivisionEntry[] = [{
    'DivisionId': 4755,
    'DivisionName': 'Super Heren - Super Division - Hommes',
    'DivisionCategory': 1,
    'Level': 1,
    'MatchType': 8,
  }, {
    'DivisionId': 4687,
    'DivisionName': 'Division 1B - National - Hommes',
    'DivisionCategory': 1,
    'Level': 1,
    'MatchType': 2,
  }];

  async getDivisionsAsync(input: GetDivisionsInput): Promise<DivisionEntry[]> {
    return Promise.resolve(this.divisions);
  }

  async getDivisionsByIdAsync(id: number, input: GetDivisionsInput = {}): Promise<DivisionEntry> {
    return Promise.resolve(this.divisions[0]);

  }
}
