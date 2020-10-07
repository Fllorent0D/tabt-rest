import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ClubEntry,
  DivisionEntry,
  GetClubsInput,
  GetMembersInput, GetMembersInputFromClub, GetTeamsInputFromClub,
  MemberEntry, TeamEntry,
} from '../../entity/tabt/TabTAPI_Port';
import { ClubService } from '../providers/club.service';
import { ClubMemberService } from '../providers/club-member.service';
import { ClubTeamService } from '../providers/club-team.service';
import { TabtException } from '../../common/filter/tabt-exceptions.filter';

@ApiTags('Clubs')
@Controller('clubs')
export class ClubController {
  constructor(
    private clubService: ClubService,
    private clubTeamService: ClubTeamService,
    private clubMemberService: ClubMemberService,
  ) {
  }

  @Get()
  @ApiResponse({
    description: 'A list of clubs.',
    type: [ClubEntry],
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  findAll(
    @Query() input: GetClubsInput,
  ) {
    return this.clubService.getClubs(input);
  }

  @Get(':ClubIndex')
  @ApiResponse({
    description: 'A specific club based on the uniqueIndex.',
    type: ClubEntry,
    status: 200,
  })
  @ApiNotFoundResponse()
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  async findbyId(
    @Query() input: GetClubsInput,
    @Param('ClubIndex') uniqueIndex: string,
  ) {
    const value = await this.clubService.getClubsById(input, uniqueIndex);
    if (!value) {
      throw new NotFoundException();
    }
    return value;
  }

  @Get(':ClubIndex/members')
  @ApiResponse({
    description: 'A list of members from a specific club.',
    type: [MemberEntry],
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  getClubMembers(
    @Query() input: GetMembersInputFromClub,
    @Param('ClubIndex') uniqueIndex: string,
  ) {
    return this.clubMemberService.getClubsMembers({ ...input, Club: uniqueIndex });
  }

  @Get(':ClubIndex/teams')
  @ApiResponse({
    description: 'A list of teams from a specific club.',
    type: [TeamEntry],
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  getClubTeams(
    @Query() input: GetTeamsInputFromClub,
    @Param('ClubIndex') uniqueIndex: string,
  ) {
    return this.clubTeamService.getClubsTeams({ ...input, Club: uniqueIndex });
  }
}
