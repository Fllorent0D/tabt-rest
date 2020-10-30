import { Injectable, Logger } from '@nestjs/common';
import { DivisionEntry, GetDivisionsInput } from '../../entity/tabt-soap/TabTAPI_Port';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';


@Injectable()
export class DivisionService {
  private readonly logger = new Logger('DivisionsService', true);

  constructor(
    private tabtClient: TabtClientService,
  ) {
  }

  async getDivisions(input: GetDivisionsInput): Promise<DivisionEntry[]> {
    const [result] = await this.tabtClient.GetDivisionsAsync(input);
    return result.DivisionEntries.map(entry => new DivisionEntry(entry));
  }

  async getDivisionsById(id: number, input: GetDivisionsInput): Promise<DivisionEntry> {
    const divisions = await this.getDivisions(input);
    return divisions.find((division) => division.DivisionId === id);
  }
}
