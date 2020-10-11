import { Injectable, Logger } from '@nestjs/common';
import { DivisionEntry, GetDivisionsInput } from '../../../entity/tabt/TabTAPI_Port';
import { TabtClientService } from '../../../common/tabt-client/tabt-client.service';


@Injectable()
export class DivisionService {
  private readonly logger = new Logger('DivisionsService', true);

  constructor(
    private tabtClient: TabtClientService,
  ) {
  }

  async getDivisionsAsync(input: GetDivisionsInput): Promise<DivisionEntry[]> {
    const [result] = await this.tabtClient.GetDivisionsAsync(input);
    return result.DivisionEntries;
  }

  async getDivisionsByIdAsync(id: number, input: GetDivisionsInput = {}): Promise<DivisionEntry> {
    const divisions = await this.getDivisionsAsync(input);
    return divisions.find((division) => division.DivisionId === id);
  }
}
