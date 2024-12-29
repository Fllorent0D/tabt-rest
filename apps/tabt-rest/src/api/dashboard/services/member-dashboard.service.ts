import { Injectable } from '@nestjs/common';
import {
  MemberDashboardDTOV1,
  MemberStatsDTOV1,
  RankingWinLossDTOV1,
} from '../dto/member-dashboard.dto';
import { DashboardServiceInterface } from '../interfaces/dashboard-service.interface';
import { RESPONSE_STATUS, ResponseDTO } from '../dto/common.dto';
import { PlayerCategory } from '../../../entity/tabt-input.interface';
import { MatchService } from '../../../services/matches/match.service';
import {
  CacheService,
  TTL_DURATION,
} from '../../../common/cache/cache.service';
import { MemberService } from '../../../services/members/member.service';
import {
  MemberEntry,
  MemberEntryResultEntry,
  TeamMatchesEntry,
} from '../../../entity/tabt-soap/TabTAPI_Port';
import { NumericRankingService } from '../../../services/members/numeric-ranking.service';
import { PlayerCategoryDTO } from 'apps/tabt-rest/src/common/dto/player-category.dto';

@Injectable()
export class MemberDashboardService
  implements DashboardServiceInterface<MemberDashboardDTOV1>
{
  constructor(
    private readonly matchService: MatchService,
    private readonly cacheService: CacheService,
    private readonly memberService: MemberService,
    private readonly numericRankingService: NumericRankingService,
  ) {}

  async getDashboard(
    memberUniqueIndex: number,
    category: PlayerCategoryDTO = PlayerCategoryDTO.SENIOR_MEN,
  ): Promise<MemberDashboardDTOV1> {
    const getter = async (): Promise<MemberDashboardDTOV1> => {
      try {
        const members: MemberEntry[] = await this.memberService.getMembers({
          UniqueIndex: memberUniqueIndex,
          WithResults: true,
        });
        const member: ResponseDTO<MemberEntry> = members?.[0]
          ? new ResponseDTO(RESPONSE_STATUS.SUCCESS, members[0])
          : new ResponseDTO(
              RESPONSE_STATUS.ERROR,
              undefined,
              'No member found for given id',
            );


        if (member.status === RESPONSE_STATUS.ERROR) {
          return new MemberDashboardDTOV1(
            ResponseDTO.error('No member found for given id'),
          );
        }

        const [numericRankingResponse, latestTeamMatches, stats] =
          await Promise.all([
            this.getNumericRanking(member.payload, category),
            this.getLatestMatches(member.payload),
            this.getMemberStats(member.payload),
          ]);

        const dashboard = new MemberDashboardDTOV1(
          ResponseDTO.success('Member dashboard retrieved successfully'),
        );

        dashboard.member = member.payload;
        dashboard.numericRanking = numericRankingResponse;
        dashboard.latestTeamMatches = latestTeamMatches;
        dashboard.stats = stats;

        return dashboard;
      } catch (error) {
        throw new MemberDashboardDTOV1(ResponseDTO.error(error.message));
      }
    };
    try {
      return await this.cacheService.getFromCacheOrGetAndCacheResult<MemberDashboardDTOV1>(
        `member-dashboard-${memberUniqueIndex}-${category}`,
        getter,
        TTL_DURATION.ONE_DAY,
      );
    } catch (error) {
      throw new MemberDashboardDTOV1(
        ResponseDTO.error('Error while retrieving member dashboard'),
      );
    }
  }

  private async getNumericRanking(
    member: MemberEntry,
    category: PlayerCategoryDTO,
  ) {
    try {
      return await this.numericRankingService.getWeeklyRankingV5(
        member.UniqueIndex,
        category,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  private async getMemberStats(member: MemberEntry): Promise<MemberStatsDTOV1> {
    try {
      const memberResultEntries = member.ResultEntries ?? [];
      const total = memberResultEntries.length;
      if (total === 0) {
        return {
          matches: {
            count: 0,
          },
          tieBreaks: {
            count: 0,
          },
          perRanking: [],
        };
      } else {
        const victories = memberResultEntries.filter((result) =>
          result.Result.startsWith('V'),
        ).length;
        const defeats = memberResultEntries.filter((result) =>
          result.Result.startsWith('D'),
        ).length;
        const defeatsPct = Math.round((defeats / total) * 100);
        const victoriesPct = Math.round((victories / total) * 100);

        const tieBreakVictories = memberResultEntries.filter(
          (result) => result.SetFor === 3 && result.SetAgainst === 2,
        ).length;
        const tieBreakdefeats = memberResultEntries.filter(
          (result) => result.SetFor === 2 && result.SetAgainst === 3,
        ).length;
        const totalTieBreak = tieBreakVictories + tieBreakdefeats;
        const tieBreakDefeatsPct = Math.floor((defeats / totalTieBreak) * 10);
        const tieBreakVictoriesPct = Math.floor(
          (victories / totalTieBreak) * 10,
        );

        const memberEntryResultEntryPerRanking: {
          [ranking: string]: MemberEntryResultEntry[];
        } = memberResultEntries.reduce((acc, value) => {
          if (acc[value.Ranking]) {
            acc[value.Ranking].push(value);
          } else {
            acc[value.Ranking] = [value];
          }
          return acc;
        }, {});
        const perRanking: RankingWinLossDTOV1[] = Object.keys(
          memberEntryResultEntryPerRanking,
        ).map((ranking) => {
          const victories = memberEntryResultEntryPerRanking[ranking].filter(
            (result) => result.Result.startsWith('V'),
          ).length;
          const defeats = memberEntryResultEntryPerRanking[ranking].filter(
            (result) => result.Result.startsWith('D'),
          ).length;
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

        return {
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
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  private async getLatestMatches(
    member: MemberEntry,
  ): Promise<TeamMatchesEntry[]> {
    try {
      const matchIds = (member.ResultEntries ?? [])
        //.sort((a, b) => b.Date.localeCompare(a.Date))
        .map((result) => result.MatchId)
        .filter((item, pos, arr) => arr.indexOf(item) === pos)
        .slice(0, 3)
        .flat();

      const clubMatches: TeamMatchesEntry[] =
        await this.matchService.getMatches({ Club: member.Club });
      return clubMatches.filter((match) => matchIds.includes(match.MatchId));
      //.sort((a, b) => b.Date.localeCompare(a.Date));
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
