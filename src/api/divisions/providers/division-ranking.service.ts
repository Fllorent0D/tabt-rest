import { Injectable, Logger } from '@nestjs/common';
import { GetDivisionRankingInput, RankingEntry } from '../../../entity/tabt/TabTAPI_Port';
import { TabtClientService } from '../../../common/tabt-client/tabt-client.service';

const CACHE_KEY = 'DIVISION-RANKING-';


@Injectable()
export class DivisionRankingService {
  private readonly logger = new Logger('DivisionRankingService', true);

  constructor(
    private tabtClient: TabtClientService,
  ) {
  }

  async getDivisionRanking(id: number, input: GetDivisionRankingInput): Promise<RankingEntry[]> {
    const [result] = await this.tabtClient.GetDivisionRankingAsync({ DivisionId: id, ...input });
    return result.RankingEntries;
  }
}
