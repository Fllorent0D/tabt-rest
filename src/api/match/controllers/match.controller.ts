import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetMatchesInput, MemberEntry, TeamMatchesEntry } from '../../../entity/tabt/TabTAPI_Port';
import { MatchService } from '../providers/match.service';
import { TabtHeadersDecorator } from '../../../common/decorators/tabt-headers.decorator';
import { ContextService } from '../../../common/context/context.service';

@ApiTags('Matches')
@Controller('matches')
@TabtHeadersDecorator()
export class MatchController {
  constructor(
    private matchService: MatchService,
    private contextServicetest: ContextService
  ) {
  }

  @Get()
  @ApiOkResponse({
    type: [TeamMatchesEntry],
    description: 'List of team matches entries',
  })
  async findAll(
    @Query() input: GetMatchesInput
  ): Promise<TeamMatchesEntry[]> {
    console.log(this.contextServicetest.context);
    return this.matchService.getMatches({ ...input });
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
  ): Promise<TeamMatchesEntry> {
    const found = await this.matchService.getMatches({ ...input, MatchUniqueId: id });
    if (found.length === 1) {
      return found[0];
    }
    throw new NotFoundException();
  }


}
