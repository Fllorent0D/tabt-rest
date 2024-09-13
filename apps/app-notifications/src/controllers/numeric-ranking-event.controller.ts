import { Controller } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NewNumericRankingEvent } from '@beping/models';
import { NumericRankingNotifierService } from '../notifications/numeric-ranking-notifier.service';
import { EventAcknowledgment } from '@beping/models/events/event-acknowledged.model';
import { BePingMessagePattern } from '@beping/models/events/message-pattern';

@Controller()
export class NumericRankingEventController {
  constructor(private readonly numericRankingNotifierService: NumericRankingNotifierService) {
  }

  @MessagePattern(BePingMessagePattern.NEW_NUMERIC_RANKING)
  async onNumericRankingUpdate(
    @Payload() payload: NewNumericRankingEvent,
  ): Promise<EventAcknowledgment> {
    const corrId = uuid();
    try {
      await this.numericRankingNotifierService.notifyPlayer(payload);
      return {
        acknowledged: true,
        correlationId: corrId
      }
    } catch (e) {
      return {
        acknowledged: false,
        correlationId: corrId
      }
    }
  }
}
