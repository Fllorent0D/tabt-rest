import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClubEntry, MemberEntry, TeamEntry, VenueEntryWithAddress } from '../../../entity/tabt-soap/TabTAPI_Port';
import { ClubService } from '../../../services/clubs/club.service';
import { ClubMemberService } from '../../../services/clubs/club-member.service';
import { ClubTeamService } from '../../../services/clubs/club-team.service';
import { TabtException } from '../../../common/filter/tabt-exceptions.filter';
import { TabtHeadersDecorator } from '../../../common/decorators/tabt-headers.decorator';
import { GetMembersFromClub, ListAllClubs } from '../dto/club.dto';
import { RequestBySeasonDto } from '../../../common/dto/request-by-season.dto';
import { ClubCategory, PlayerCategory } from '../../../entity/tabt-input.interface';
import { GeocoderService } from '../../../services/geocoder/geocoder.service';
import { MatchesMembersRankerService } from '../../../services/matches/matches-members-ranker.service';
import { MemberResults } from '../../../common/dto/member-ranking.dto';

@ApiTags('Clubs')
@Controller('clubs')
@TabtHeadersDecorator()
export class ClubController {
  constructor(
    private clubService: ClubService,
    private clubTeamService: ClubTeamService,
    private clubMemberService: ClubMemberService,
    private geocoderService: GeocoderService,
    private matchesMembersRankerService: MatchesMembersRankerService
  ) {
  }

  @Get()
  @ApiOperation({
    operationId: 'findAllClubs',
  })
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
    @Query() input: ListAllClubs,
  ) {
    return this.clubService.getClubs({ ClubCategory: ClubCategory[input.clubCategory] });
  }

  @Get(':clubIndex')
  @ApiOperation({
    operationId: 'findClubById',
  })
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
    @Param('clubIndex') uniqueIndex: string,
  ) {
    const value = await this.clubService.getClubById(uniqueIndex);
    if (!value) {
      throw new NotFoundException();
    }
    return value;
  }

  @Get(':clubIndex/members')
  @ApiOperation({
    operationId: 'findClubMembers',
  })
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
    @Query() input: GetMembersFromClub,
    @Param('clubIndex') uniqueIndex: string,
  ) {
    return this.clubMemberService.getClubsMembers({
      Club: uniqueIndex,
      PlayerCategory: PlayerCategory[input.playerCategory] as unknown as number,
      UniqueIndex: input.uniqueIndex,
      NameSearch: input.nameSearch,
      ExtendedInformation: input.extendedInformation,
      RankingPointsInformation: input.rankingPointsInformation,
      WithResults: input.withResults,
      WithOpponentRankingEvaluation: input.withOpponentRankingEvaluation,
    });
  }

  @Get(':clubIndex/teams')
  @ApiOperation({
    operationId: 'findClubTeams',
  })
  @ApiResponse({
    description: 'A list of teams from a specific club.',
    type: [TeamEntry],
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  getClubTeams(
    @Query() input: RequestBySeasonDto,
    @Param('clubIndex') uniqueIndex: string,
  ) {
    return this.clubTeamService.getClubsTeams({ Club: uniqueIndex });
  }

  @Get(':clubIndex/teams/:teamId/ranking')
  @ApiOperation({
    operationId: 'findClubTeamsMemberRanking',
  })
  @ApiResponse({
    description: 'A ranking of all players from a team.',
    type: [MemberResults],
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  getClubTeamsMembersRanking(
    @Query() input: RequestBySeasonDto,
    @Param('clubIndex') clubIndex: string,
    @Param('teamId') teamId: string,
  ) {
    return this.matchesMembersRankerService.getMembersRankingFromTeam(clubIndex, teamId, input.season);
  }

  @Get(':clubIndex/venues')
  @ApiOperation({
    operationId: 'findClubVenues',
  })
  @ApiResponse({
    description: 'A club GPS coordinates for venues.',
    type: [VenueEntryWithAddress],
    status: 200,
  })
  async getClubVenuesDetails(
    @Query() input: RequestBySeasonDto,
    @Param('clubIndex') uniqueIndex: string,
  ) {
    const club = await this.clubService.getClubById(uniqueIndex);
    const venues: VenueEntryWithAddress[] = [];
    for (const venue of club.VenueEntries) {
      try {
        const [street, houseNumber] = venue.Street.split(', ');

        const postalCode = venue.Town.slice(0,4);
        const town = venue.Town.slice(5);

        const test = await this.geocoderService.search(`${houseNumber} ${street}`, town, postalCode);
        console.log(test);
        venues.push({ ...venue, Address: test });
      } catch (e) {
        venues.push(venue);
      }
    }
    return venues;

  }


  @Get(':clubIndex/members/ranking')
  @ApiOperation({
    operationId: 'findDivisionMembers',
  })
  @ApiResponse({
    description: 'A ranking of members playing in a given division.',
    type: [MemberResults],
    status: 200,
  })
  @ApiResponse({
    status: 400,
    type: TabtException,
  })
  async findClubMembersRanking(
    @Param('clubIndex') id: string,
    @Query() query: RequestBySeasonDto,
  ): Promise<MemberResults[]> {
    return this.matchesMembersRankerService.getMembersRankingFromClub(id, query.season);
  }
}
