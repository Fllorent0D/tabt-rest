import { Injectable } from '@nestjs/common';
import { GetDivisionRankingInput, RankingEntry } from '../../entity/tabt-soap/TabTAPI_Port';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';


@Injectable()
export class DivisionRankingService {

  constructor(
    private tabtClient: TabtClientService,
  ) {
  }

  async getDivisionRanking(input: GetDivisionRankingInput): Promise<RankingEntry[]> {
    const result = await this.tabtClient.GetDivisionRankingAsync({ ...input });
    return result.RankingEntries;
  }
}
