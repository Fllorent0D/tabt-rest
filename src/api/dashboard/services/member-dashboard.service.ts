import { Injectable } from '@nestjs/common';
import { getSimplifiedPlayerCategory } from 'src/api/member/helpers/player-category-helpers';
import { CacheService, TTL_DURATION } from 'src/common/cache/cache.service';
import { MemberEntry, MemberEntryResultEntry, TeamMatchesEntry } from 'src/entity/tabt-soap/TabTAPI_Port';
import { MatchService } from 'src/services/matches/match.service';
import { EloMemberService } from 'src/services/members/elo-member.service';
import { MemberService } from 'src/services/members/member.service';
import { MemberDashboardDTOV1, MemberStatsDTOV1, RankingWinLossDTOV1 } from '../dto/member-dashboard.dto';
import { PLAYER_CATEGORY } from 'src/api/member/dto/member.dto';
import { DashboardServiceInterface } from '../interfaces/dashboard-service.interface';
import { RESPONSE_STATUS, ResponseDTO } from '../dto/common.dto';
import { PlayerCategory } from '../../../entity/tabt-input.interface';

@Injectable()
export class MemberDashboardService implements DashboardServiceInterface<MemberDashboardDTOV1> {

  constructor(
    private readonly matchService: MatchService,
    private readonly cacheService: CacheService,
    private readonly memberService: MemberService,
    private readonly eloMemberService: EloMemberService,
  ) {
  }

  async getDashboard(memberUniqueIndex: number, category: PLAYER_CATEGORY = PLAYER_CATEGORY.MEN): Promise<MemberDashboardDTOV1> {
    const getter = async (): Promise<MemberDashboardDTOV1> => {
      const members: MemberEntry[] = await this.memberService.getMembers({
        UniqueIndex: memberUniqueIndex,
        WithResults: true,
      });
      const member: ResponseDTO<MemberEntry> = members?.[0] ?
        new ResponseDTO(RESPONSE_STATUS.SUCCESS, members[0]) :
        new ResponseDTO(RESPONSE_STATUS.ERROR, undefined, 'No member found for given id');

      const simplifiedCategory = getSimplifiedPlayerCategory(category);

      if (member.status === RESPONSE_STATUS.ERROR) {
        return new MemberDashboardDTOV1(
          member,
          new ResponseDTO(RESPONSE_STATUS.ERROR, undefined, 'No member found for given id'),
          new ResponseDTO(RESPONSE_STATUS.ERROR, undefined, 'No member found for given id'),
          new ResponseDTO(RESPONSE_STATUS.ERROR, undefined, 'No member found for given id'),
        );
      }

      const numericRankingResponse = await this.getNumericRanking(member.payload, simplifiedCategory);
      const latestTeamMatches = await this.getLatestMatches(member.payload);
      const stats = await this.getMemberStats(member.payload);
      return new MemberDashboardDTOV1(member, numericRankingResponse, latestTeamMatches, stats);
    };

    return this.cacheService.getFromCacheOrGetAndCacheResult<MemberDashboardDTOV1>(`member-dashboard-${memberUniqueIndex}-${category}`, getter, TTL_DURATION.ONE_DAY);
  }

  private async getNumericRanking(member: MemberEntry, simplifiedCategory: PlayerCategory.MEN | PlayerCategory.WOMEN) {
    try {
      const numericRanking = await this.eloMemberService.getBelNumericRankingV3(member.UniqueIndex, simplifiedCategory);
      return new ResponseDTO(RESPONSE_STATUS.SUCCESS, numericRanking);
    } catch (error) {
      return new ResponseDTO(RESPONSE_STATUS.ERROR, undefined, error.message);
    }
  }

  private async getMemberStats(member: MemberEntry): Promise<ResponseDTO<MemberStatsDTOV1>> {
    try {
      const memberResultEntries = member.ResultEntries ?? [];
      const total = memberResultEntries.length;
      if (total === 0) {
        return new ResponseDTO<MemberStatsDTOV1>(RESPONSE_STATUS.SUCCESS, {
          matches: {
            count: 0,
          },
          tieBreaks: {
            count: 0,
          },
          perRanking: [],
        });
      } else {
        const victories = memberResultEntries.filter((result) => result.Result.startsWith('V')).length;
        const defeats = memberResultEntries.filter((result) => result.Result.startsWith('D')).length;
        const defeatsPct = Math.round((defeats / total) * 100);
        const victoriesPct = Math.round((victories / total) * 100);

        const tieBreakVictories = memberResultEntries.filter((result) => result.SetFor === 3 && result.SetAgainst === 2).length;
        const tieBreakdefeats = memberResultEntries.filter((result) => result.SetFor === 2 && result.SetAgainst === 3).length;
        const totalTieBreak = tieBreakVictories + tieBreakdefeats;
        const tieBreakDefeatsPct = Math.floor((defeats / totalTieBreak) * 100);
        const tieBreakVictoriesPct = Math.floor((victories / totalTieBreak) * 100);

        const memberEntryResultEntryPerRanking: {
          [ranking: string]: MemberEntryResultEntry[]
        } = memberResultEntries.reduce((acc, value) => {
          if (acc[value.Ranking]) {
            acc[value.Ranking].push(value);
          } else {
            acc[value.Ranking] = [value];
          }
          return acc;
        }, {});
        const perRanking: RankingWinLossDTOV1[] = Object.keys(memberEntryResultEntryPerRanking).map((ranking) => {
          const victories = memberEntryResultEntryPerRanking[ranking].filter((result) => result.Result.startsWith('V')).length;
          const defeats = memberEntryResultEntryPerRanking[ranking].filter((result) => result.Result.startsWith('D')).length;
          const total = victories + defeats;
          return {
            ranking,
            victories,
            defeats,
            count: total,
            victoriesPct: Math.round((victories / total) * 100),
            defeatsPct: Math.round((defeats / total) * 100),
            players: memberEntryResultEntryPerRanking[ranking],
          };
        });

        const stats = {
          matches: {
            count: total,
            victories,
            defeats,
            victoriesPct,
            defeatsPct,
          },
          tieBreaks: {
            count: totalTieBreak,
            victories: tieBreakVictories,
            defeats: tieBreakdefeats,
            victoriesPct: tieBreakVictoriesPct,
            defeatsPct: tieBreakDefeatsPct,
          },
          perRanking,
        };
        return new ResponseDTO(RESPONSE_STATUS.SUCCESS, stats);
      }
    } catch (error) {
      return new ResponseDTO(RESPONSE_STATUS.ERROR, undefined, error.message);
    }


  }

  private async getLatestMatches(member: MemberEntry): Promise<ResponseDTO<TeamMatchesEntry[]>> {
    try {
      const matchIds = (member.ResultEntries ?? [])
        //.sort((a, b) => b.Date.localeCompare(a.Date))
        .map((result) => result.MatchId)
        .filter((item, pos, arr) => arr.indexOf(item) === pos)
        .slice(0, 3)
        .flat();

      const clubMatches: TeamMatchesEntry[] = await this.matchService.getMatches({ Club: member.Club });
      const filteredMatches = clubMatches
        .filter((match) => matchIds.includes(match.MatchId));
      //.sort((a, b) => b.Date.localeCompare(a.Date));
      return new ResponseDTO(RESPONSE_STATUS.SUCCESS, filteredMatches);

    } catch (error) {
      return new ResponseDTO(RESPONSE_STATUS.ERROR, undefined, error.message);
    }

  }
}
