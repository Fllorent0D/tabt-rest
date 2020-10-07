import { Controller, Get } from '@nestjs/common';
import { SeasonService } from '../providers/season.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClubEntry, SeasonEntry } from '../../entity/tabt/TabTAPI_Port';
import { TabtException } from '../../common/filter/tabt-exceptions.filter';

@Controller('seasons')
@ApiTags('Seasons')
export class SeasonController {
  constructor(
    private seasonService: SeasonService,
  ) {
  }

  @Get()
  @ApiResponse({
    description: 'A list of seasons.',
    type: [SeasonEntry],
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  findAll() {
    return this.seasonService.getSeasons({Credentials: {Account:'a', Password:'a'}});
  }

  @Get('current')
  @ApiResponse({
    description: 'The current season.',
    type: SeasonEntry,
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  findCurrentSeason() {
    return this.seasonService.getCurrentSeason({Credentials: {Account:'a', Password:'a'}});
  }

}
