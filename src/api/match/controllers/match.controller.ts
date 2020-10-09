import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  TeamMatchesEntry,
  MemberEntry,
  GetMatchesInput, Credentials,
} from '../../../entity/tabt/TabTAPI_Port';
import { MatchService } from '../providers/match.service';
import { TabtHeaders } from '../../../common/headers/tabt-headers';
import { TabtCredentials } from '../../../common/decorators/TabtCredentials.decorator';

@ApiTags('Matches')
@Controller('matches')
@TabtHeaders()
export class MatchController {
  constructor(
    private matchService: MatchService,
  ) {
  }

  @Get()
  @ApiOkResponse({
    type: [TeamMatchesEntry],
    description: 'List of team matches entries',
  })
  async findAll(
    @Query() input: GetMatchesInput,
    @TabtCredentials() credentials: Credentials,
  ): Promise<TeamMatchesEntry[]> {
    return this.matchService.getMatches({ ...input, Credentials: credentials });
  }

  @Get(':MatchUniqueId')
  @ApiOkResponse({
    type: MemberEntry,
    description: 'The information of a specific player',
  })
  @ApiNotFoundResponse()
  async findById(
    @Query() input: GetMatchesInput,
    @Param('MatchUniqueId') id: string,
    @TabtCredentials() credentials: Credentials,
  ): Promise<TeamMatchesEntry> {
    const found = await this.matchService.getMatches({ ...input, Credentials: credentials, MatchUniqueId: id });
    if (found.length === 1) {
      return found[0];
    }
    throw new NotFoundException();
  }


}
