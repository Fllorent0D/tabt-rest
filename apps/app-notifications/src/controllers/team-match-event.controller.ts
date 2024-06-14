import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventBusService } from '../common/event-bus/event-bus.service';
import { TabtEventType } from '../common/event-bus/models/event.model';
import { v4 as uuid } from 'uuid';
import { TeamMatchEventDTO } from './dto/team-match-event-d-t.o';

@Controller('event')
export class TeamMatchEventController {
  constructor(private readonly eventBusService: EventBusService) {}

  @Post('team-match-encoded')
  //@UseGuards(AuthGuard('basic'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async teamMatchEvent(@Body() teamMatchEvent: TeamMatchEventDTO) {
    const corrId = uuid();

    this.eventBusService.emitEvent({
      type: TabtEventType.MATCH_RESULT_RECEIVED,
      payload: teamMatchEvent,
      corrId,
    });

    return {
      acknowledged: true,
      correlationId: corrId,
    };
  }
}
