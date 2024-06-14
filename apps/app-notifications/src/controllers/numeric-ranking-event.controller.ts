import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventBusService } from '../common/event-bus/event-bus.service';
import { v4 as uuid } from 'uuid';
import { NumericRankingEventDto } from './dto/numeric-ranking-event.dto';
import { TabtEventType } from '../common/event-bus/models/event.model';
import { AuthGuard } from '@nestjs/passport';

@Controller('numeric-ranking')
export class NumericRankingEventController {
  constructor(private readonly eventBusService: EventBusService) {}

  @Post('update')
  @UseGuards(AuthGuard('basic'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async onNumericRankingUpdate(
    @Body() numericRankingEvent: NumericRankingEventDto,
  ) {
    const corrId = uuid();

    this.eventBusService.emitEvent({
      type: TabtEventType.NUMERIC_RANKING_RECEIVED,
      payload: {
        ...numericRankingEvent,
      },
      corrId,
    });

    return {
      acknowledged: true,
      correlationId: corrId,
    };
  }
}
