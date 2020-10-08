import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MemberService } from '../../member/providers/member.service';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  TeamMatchesEntry,
  MemberEntry,
  GetMatchesInput,
} from '../../../entity/tabt/TabTAPI_Port';
import { MatchService } from '../providers/match.service';
import { TabtHeaders } from '../../../common/headers/tabt-headers';
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
    description: 'List of team matches entries'
  })
  async findAll(@Query() input: GetMatchesInput): Promise<TeamMatchesEntry[]> {
    return this.matchService.getMatches(input);
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
