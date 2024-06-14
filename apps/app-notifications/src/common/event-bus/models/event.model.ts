import { TeamMatchEventDTO } from '../../../controllers/dto/team-match-event-d-t.o';
import { NumericRankingEventDto } from '../../../controllers/dto/numeric-ranking-event.dto';

export enum TabtEventType {
  MATCH_RESULT_UPDATE = 'MATCH_RESULT_UPDATE',
  MATCH_RESULT_RECEIVED = 'MATCH_RESULT_RECEIVED',
  NUMERIC_RANKING_RECEIVED = 'NUMERIC_RANKING_RECEIVED',
}

export interface TabtEvent<T = TabtEventPayloadTypes> {
  type: TabtEventType;
  payload: T;
  corrId: string;
}

export type TabtEventPayloadTypes = TeamMatchEventDTO | NumericRankingEventDto;
