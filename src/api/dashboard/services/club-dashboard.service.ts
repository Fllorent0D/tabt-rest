import { Injectable, NotFoundException } from '@nestjs/common';
import { ClubService } from '../../../services/clubs/club.service';
import { DashboardServiceInterface } from '../interfaces/dashboard-service.interface';
import { DivisionMemberDashboardDTOV1 } from '../dto/division-dashboard.dto';
import { MatchesMembersRankerService } from '../../../services/matches/matches-members-ranker.service';
import { DivisionMemberDashboardDTOV1Mapper } from '../dto/mappers/division-member-dashboard-dto-v1.mapper';
import { ClubDashboardDTOV1 } from '../dto/club-dashboard.dto';
import { MemberService } from '../../../services/members/member.service';
import { MatchService } from '../../../services/matches/match.service';
import { ClubTeamService } from '../../../services/clubs/club-team.service';
import { ClubEntry, MemberEntry, TeamEntry, TeamMatchesEntry } from '../../../entity/tabt-soap/TabTAPI_Port';
import { RESPONSE_STATUS, ResponseDTO } from '../dto/common.dto';

@Injectable()
export class ClubDashboardService implements DashboardServiceInterface<ClubDashboardDTOV1> {

  constructor(
    private readonly clubService: ClubService,
    private readonly matchesMembersRankerService: MatchesMembersRankerService,
    private readonly memberService: MemberService,
    private readonly matchService: MatchService,
    private readonly clubTeamService: ClubTeamService,
  ) {
  }

  async getDashboard(clubUniqueIndex: string): Promise<ClubDashboardDTOV1> {
    const club = await this.getClub(clubUniqueIndex);
    if (!club.payload) {
      return {
        club: new ResponseDTO(RESPONSE_STATUS.ERROR, undefined, 'No club found for given id'),
        members: new ResponseDTO(RESPONSE_STATUS.ERROR, undefined, 'No club found for given id'),
        teams: new ResponseDTO(RESPONSE_STATUS.ERROR, undefined, 'No club found for given id'),
        matches: new ResponseDTO(RESPONSE_STATUS.ERROR, undefined, 'No club found for given id'),
      }
    }


    const [members, teams, matches] = await Promise.all([
      this.getClubMembers(clubUniqueIndex),
      this.getClubTeams(clubUniqueIndex),
      this.getClubMatchesGrouped(clubUniqueIndex),
    ]);


    return {
      club,
      members,
      teams,
      matches,
    };
  }

  async getPlayersStats(divisionId: number): Promise<DivisionMemberDashboardDTOV1[]> {
    const results = await this.matchesMembersRankerService.getMembersRankingFromDivision(divisionId);
    // map the results to the DTO
    return results.map(DivisionMemberDashboardDTOV1Mapper.mapMemberResults);
  };

  private async getClubsMembers(clubUniqueIndex: string): Promise<ResponseDTO<MemberEntry[]>> {
    try {
      const members = await this.memberService.getMembers({ Club: clubUniqueIndex });
      return new ResponseDTO(RESPONSE_STATUS.SUCCESS, members);
    } catch (error) {
      return new ResponseDTO(RESPONSE_STATUS.ERROR, undefined, error.message);
    }
  }

  private async getClub(clubUniqueIndex: string): Promise<ResponseDTO<ClubEntry>> {
    try {
      const clubs = await this.clubService.getClubs({ Club: clubUniqueIndex });
      if(!clubs?.[0]) {
        return new ResponseDTO(RESPONSE_STATUS.ERROR, undefined, 'No club found for given id');
      }
      return new ResponseDTO(RESPONSE_STATUS.SUCCESS, clubs[0]);
    } catch (error) {
      return new ResponseDTO(RESPONSE_STATUS.ERROR, undefined, error.message);
    }
  }

  private async getClubMembers(clubUniqueIndex: string): Promise<ResponseDTO<MemberEntry[]>> {
    try {
      const members = await this.memberService.getMembers({ Club: clubUniqueIndex });
      return new ResponseDTO(RESPONSE_STATUS.SUCCESS, members);
    } catch (error) {
      return new ResponseDTO(RESPONSE_STATUS.ERROR, undefined, error.message);
    }
  }

  private async getClubTeams(clubUniqueIndex: string): Promise<ResponseDTO<TeamEntry[]>> {
    try {
      const teams = await this.clubTeamService.getClubsTeams({ Club: clubUniqueIndex });
      return new ResponseDTO(RESPONSE_STATUS.SUCCESS, teams);
    } catch (error) {
      return new ResponseDTO(RESPONSE_STATUS.ERROR, undefined, error.message);
    }
  }


  private async getClubMatchesGrouped(clubUniqueIndex: string): Promise<ResponseDTO<{ [weekname: number]: TeamMatchesEntry[] }>> {
    try {
      const matches = await this.matchService.getMatches({ Club: clubUniqueIndex });
      const reduced = matches.reduce<{ [weekName: number]: TeamMatchesEntry[] }>((acc, currentValue) => {
        const weekName = Number(currentValue.WeekName);
        if (acc[weekName]) {
          acc[weekName].push(currentValue);
        } else {
          acc[weekName] = [currentValue];
        }
        return acc;
      }, {});
      return new ResponseDTO(RESPONSE_STATUS.SUCCESS, reduced);
    } catch (error) {
      return new ResponseDTO(RESPONSE_STATUS.ERROR, undefined, error.message

      )
    }

  }
}
