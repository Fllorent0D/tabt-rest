import { Injectable } from '@nestjs/common';
import {
  MemberDashboardDTOV1,
  MemberStatsDTOV1,
  NextMatchEstimationDTO,
  OpponentEstimationDTO,
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
import { NumericRankingService, WeeklyRankingV1Response } from '../../../services/members/numeric-ranking.service';
import { PlayerCategoryDTO } from 'apps/tabt-rest/src/common/dto/player-category.dto';
import { MEN_RANKING_ESTIMATION, WOMAN_RANKING_ESTIMATION } from '../../../common/consts/ranking-estimation';
import { MatchesMembersRankerService, SortSystem } from '../../../services/matches/matches-members-ranker.service';
import { PointsEstimationService } from '../../../services/members/points-estimation.service';

@Injectable()
export class MemberDashboardService
  implements DashboardServiceInterface<MemberDashboardDTOV1>
{
  constructor(
    private readonly matchService: MatchService,
    private readonly cacheService: CacheService,
    private readonly memberService: MemberService,
    private readonly numericRankingService: NumericRankingService,
    private readonly matchesMembersRankerService: MatchesMembersRankerService,
    private readonly pointsEstimationService: PointsEstimationService,
  ) {}

  async getDashboard(
    memberUniqueIndex: number,
    category: PlayerCategoryDTO = PlayerCategoryDTO.SENIOR_MEN,
    teamId?: string,
  ): Promise<MemberDashboardDTOV1> {
    const getter = async (): Promise<MemberDashboardDTOV1> => {
      try {
        const members: MemberEntry[] = await this.memberService.getMembersV1({
          uniqueIndex: memberUniqueIndex,
          withResults: true,
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

        // Get numeric ranking first
        const numericRankingResponse = await this.getNumericRanking(memberUniqueIndex, category);

        // Then get the rest of the data
        const [latestTeamMatches, stats, nextMatchEstimation] = await Promise.all([
          this.getLatestMatches(member.payload),
          this.getMemberStats(member.payload, numericRankingResponse),
          teamId ? this.getNextMatchEstimation(member.payload, teamId, category) : undefined,
        ]);

        const dashboard = new MemberDashboardDTOV1(
          ResponseDTO.success('Member dashboard retrieved successfully'),
        );

        dashboard.member = member.payload;
        dashboard.numericRanking = numericRankingResponse;
        dashboard.latestTeamMatches = latestTeamMatches;
        dashboard.stats = stats;
        dashboard.nextMatchEstimation = nextMatchEstimation;

        return dashboard;
      } catch (error) {
        throw new MemberDashboardDTOV1(ResponseDTO.error(error.message));
      }
    };
    try {
      return getter();
    } catch (error) {
      throw new MemberDashboardDTOV1(
        ResponseDTO.error('Error while retrieving member dashboard'),
      );
    }
  }

  private async getNumericRanking(
    uniqueIndex: number,
    category: PlayerCategoryDTO,
  ) {
    try {
      return await this.numericRankingService.getWeeklyRankingV1(
        uniqueIndex,
        category,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  private async getMemberStats(
    member: MemberEntry,
    numericRanking?: WeeklyRankingV1Response,
  ): Promise<MemberStatsDTOV1> {
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
          sets: {
            total: 0,
            won: 0,
            lost: 0,
            wonPct: 0,
            lostPct: 0,
          },
          winStreak: {
            current: 0,
            best: 0,
            worst: 0,
          },
          lossStreak: {
            current: 0,
            best: 0,
            worst: 0,
          },
          seasonExtremes: {
            highestRanking: member.Ranking,
            lowestRanking: member.Ranking,
            highestPoints: 0,
            lowestPoints: 0,
            firstMatch: '',
            lastMatch: '',
          },
          matchHistory: [],
          timeOfDay: [],
          dayOfWeek: [],
          monthly: [],
          matchDetails: {
            averageSetsPerMatch: 0,
            cleanVictories: 0,
            cleanDefeats: 0,
            comebacks: 0,
            leadLost: 0,
          },
        };
      }

      // Sort entries by date for streak and chronological analysis
      const sortedEntries = [...memberResultEntries].sort((a, b) => {
        const dateA = new Date(a.Date);
        const dateB = new Date(b.Date);
        return dateA.getTime() - dateB.getTime();
      });
        
      // Match history
      const matchHistory = sortedEntries.map(entry => ({
        date: entry.Date,
        result: entry.Result as 'V' | 'D',
        opponentName: `${entry.FirstName} ${entry.LastName}`,
        opponentRanking: entry.Ranking,
        score: `${entry.SetFor}-${entry.SetAgainst}`,
      }));
      
      // Basic match statistics
      const victories = memberResultEntries.filter((result) => result.Result.startsWith('V')).length;
      const defeats = memberResultEntries.filter((result) => result.Result.startsWith('D')).length;
      const defeatsPct = Math.round((defeats / total) * 100);
      const victoriesPct = Math.round((victories / total) * 100);

      // Set statistics
      const totalSets = memberResultEntries.reduce((acc, result) => acc + result.SetFor + result.SetAgainst, 0);
      const wonSets = memberResultEntries.reduce((acc, result) => acc + result.SetFor, 0);
      const lostSets = memberResultEntries.reduce((acc, result) => acc + result.SetAgainst, 0);

      // Time-based analysis
      const timeSlots = {
        morning: { start: 6, end: 12 },
        afternoon: { start: 12, end: 18 },
        evening: { start: 18, end: 24 },
      };

      const timeOfDayStats = Object.entries(timeSlots).map(([slot, { start, end }]) => {
        const matches = memberResultEntries.filter(match => {
          const hour = new Date(match.Date).getHours();
          return hour >= start && hour < end;
        });
        const wins = matches.filter(m => m.Result === 'V').length;
        const losses = matches.filter(m => m.Result === 'D').length;
        const total = wins + losses;
        return {
          timeSlot: slot as 'morning' | 'afternoon' | 'evening',
          count: total,
          victories: wins,
          defeats: losses,
          victoriesPct: total > 0 ? Math.round((wins / total) * 100) : 0,
          defeatsPct: total > 0 ? Math.round((losses / total) * 100) : 0,
        };
      });

      // Day of week analysis
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayOfWeekStats = days.map(day => {
        const matches = memberResultEntries.filter(match => 
          days[new Date(match.Date).getDay()] === day
        );
        const wins = matches.filter(m => m.Result === 'V').length;
        const losses = matches.filter(m => m.Result === 'D').length;
        const total = wins + losses;
        return {
          day,
          count: total,
          victories: wins,
          defeats: losses,
          victoriesPct: total > 0 ? Math.round((wins / total) * 100) : 0,
          defeatsPct: total > 0 ? Math.round((losses / total) * 100) : 0,
        };
      });

      // Monthly analysis
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
      const monthlyStats = months.map(month => {
        const matches = memberResultEntries.filter(match => 
          months[new Date(match.Date).getMonth()] === month
        );
        const wins = matches.filter(m => m.Result === 'V').length;
        const losses = matches.filter(m => m.Result === 'D').length;
        const total = wins + losses;
        return {
          month,
          count: total,
          victories: wins,
          defeats: losses,
          victoriesPct: total > 0 ? Math.round((wins / total) * 100) : 0,
          defeatsPct: total > 0 ? Math.round((losses / total) * 100) : 0,
        };
      });

      // Match details analysis
      const matchDetails = {
        averageSetsPerMatch: Math.round((totalSets / total) * 100) / 100,
        cleanVictories: memberResultEntries.filter(m => m.Result === 'V' && m.SetFor === 3 && m.SetAgainst === 0).length,
        cleanDefeats: memberResultEntries.filter(m => m.Result === 'D' && m.SetFor === 0 && m.SetAgainst === 3).length,
        // TODO: Check if this is correct
        comebacks: memberResultEntries.filter(m => 
          m.Result === 'V' && (
            (m.SetFor === 3 && m.SetAgainst === 2 && m.SetFor < m.SetAgainst) // was down 0-2 or 1-2
          )
        ).length,
        leadLost: memberResultEntries.filter(m => 
          m.Result === 'D' && (
            (m.SetFor === 2 && m.SetAgainst === 3 && m.SetFor > m.SetAgainst) // was up 2-0 or 2-1
          )
        ).length,
      };

      // Tie break statistics
      const tieBreakVictories = memberResultEntries.filter(
        (result) => result.SetFor === 3 && result.SetAgainst === 2,
      ).length;
      const tieBreakdefeats = memberResultEntries.filter(
        (result) => result.SetFor === 2 && result.SetAgainst === 3,
      ).length;
      const totalTieBreak = tieBreakVictories + tieBreakdefeats;
      const tieBreakDefeatsPct = Math.floor((tieBreakdefeats / totalTieBreak) * 100) || 0;
      const tieBreakVictoriesPct = Math.floor((tieBreakVictories / totalTieBreak) * 100) || 0;

      // Streak calculations
      let currentStreak = 0;
      let bestWinStreak = 0;
      let worstLossStreak = 0;
      let currentWinStreak = 0;
      let currentLossStreak = 0;

      sortedEntries.forEach((result) => {
        if (result.Result.startsWith('V')) {
          currentWinStreak++;
          currentLossStreak = 0;
          bestWinStreak = Math.max(bestWinStreak, currentWinStreak);
        } else {
          currentLossStreak++;
          currentWinStreak = 0;
          worstLossStreak = Math.max(worstLossStreak, currentLossStreak);
        }
      });

      // Current streak (positive for wins, negative for losses)
      for (let i = sortedEntries.length - 1; i >= 0; i--) {
        const result = sortedEntries[i];
        if (currentStreak === 0) {
          currentStreak = result.Result.startsWith('V') ? 1 : -1;
        } else if (
          (currentStreak > 0 && result.Result.startsWith('V')) ||
          (currentStreak < 0 && result.Result.startsWith('D'))
        ) {
          currentStreak = currentStreak + (currentStreak > 0 ? 1 : -1);
        } else {
          break;
        }
      }

      // Rankings per opponent statistics
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

      const perRanking: RankingWinLossDTOV1[] = Object.keys(memberEntryResultEntryPerRanking).map(
        (ranking) => {
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
        },
      );

      // Season extremes from numeric ranking history
      let highestPoints = 0;
      let lowestPoints = Infinity;
      let highestRanking = member.Ranking;
      let lowestRanking = member.Ranking;

      if (numericRanking?.numericRankingHistory?.length) {
        const history = numericRanking.numericRankingHistory;
        history.forEach(entry => {
          if (entry.numericPoints > highestPoints) {
            highestPoints = entry.numericPoints;
          }
          if (entry.numericPoints < lowestPoints) {
            lowestPoints = entry.numericPoints;
          }
          if (entry.rankingLetterEstimation) {
            if (!highestRanking || entry.rankingLetterEstimation < highestRanking) {
              highestRanking = entry.rankingLetterEstimation;
            }
            if (!lowestRanking || entry.rankingLetterEstimation > lowestRanking) {
              lowestRanking = entry.rankingLetterEstimation;
            }
          }
        });
      }

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
        sets: {
          total: totalSets,
          won: wonSets,
          lost: lostSets,
          wonPct: Math.round((wonSets / totalSets) * 100),
          lostPct: Math.round((lostSets / totalSets) * 100),
        },
        winStreak: {
          current: currentStreak > 0 ? currentStreak : 0,
          best: bestWinStreak,
          worst: 0,
        },
        lossStreak: {
          current: currentStreak < 0 ? Math.abs(currentStreak) : 0,
          best: 0,
          worst: worstLossStreak,
        },
        seasonExtremes: {
          highestRanking,
          lowestRanking,
          highestPoints: Math.round(highestPoints * 100) / 100,
          lowestPoints: lowestPoints === Infinity ? 0 : Math.round(lowestPoints * 100) / 100,
          firstMatch: sortedEntries[0]?.Date || '',
          lastMatch: sortedEntries[sortedEntries.length - 1]?.Date || '',
        },
        matchHistory,
        timeOfDay: timeOfDayStats,
        dayOfWeek: dayOfWeekStats,
        monthly: monthlyStats,
        matchDetails,
      };
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

  private async getNextMatchEstimation(
    member: MemberEntry,
    teamId: string,
    category: PlayerCategoryDTO,
  ): Promise<NextMatchEstimationDTO | undefined> {
    try {
      // Get all matches for the team
      const matches = await this.matchService.getMatches({
        Club: member.Club,
        Team: teamId,
        WithDetails: true,
      });

      // Find the next match (first match with a date in the future)
      const now = new Date();
      const nextMatch = matches.find(match => new Date(match.Date) > now);

      if (!nextMatch) {
        return undefined;
      }

      // Get the opponent players (from away team if we're home team, or vice versa)
      const isHomeTeam = nextMatch.HomeClub === member.Club && nextMatch.HomeTeam === teamId;
      const opponentClub = isHomeTeam ? nextMatch.AwayClub : nextMatch.HomeClub;
      const divisionId = nextMatch.DivisionId;

      // Get all players from the division
      const divisionPlayers = await this.matchesMembersRankerService.getMembersRankingFromDivision(
        Number(divisionId),
        SortSystem.MOST_PLAYED,
      );

      // Filter players from the opponent club
      const opponentPlayers = divisionPlayers.filter(player => player.club === opponentClub);

      if (!opponentPlayers.length) {
        return undefined;
      }

      // Get player's current ranking & points
      const playerRanking = await this.numericRankingService.getWeeklyRankingV1(
        member.UniqueIndex,
        category,
      );
      const playerPoints = playerRanking.numericRankingHistory[playerRanking.numericRankingHistory.length - 1].numericPoints;

      // Get all opponents' ranking & points
      const opponentPlayersRanking = await Promise.all(opponentPlayers.map(async (player) => {
        const ranking = await this.numericRankingService.getWeeklyRankingV1(player.uniqueIndex, category);
        return {
          ...player,
          rankingLetter: ranking.numericRankingHistory[ranking.numericRankingHistory.length - 1].rankingLetterEstimation,
          points: ranking.numericRankingHistory[ranking.numericRankingHistory.length - 1].numericPoints,
        };
      }));

      // Function to calculate points for an opponent
      const calculateOpponentPoints = (opponent: typeof opponentPlayersRanking[0]): OpponentEstimationDTO => {
        const estimation = this.pointsEstimationService.estimatePoints(
          playerPoints,
          opponent.points,
          nextMatch.DivisionName,
          category,
        );

        const pointsDifference = playerPoints - opponent.points;
        const isExpectedWin = pointsDifference > 0;

        return {
          firstName: opponent.firstName,
          lastName: opponent.lastName,
          ranking: opponent.rankingLetter,
          pointsToWin: isExpectedWin ? estimation.expectedWinPoints : estimation.unexpectedWinPoints,
          coefficient: estimation.coefficient,
          isExpectedWin,
          pointsDifference: Math.abs(pointsDifference),
        };
      };

      // Best case: players with most points difference (more points to win)
      const bestCase = [...opponentPlayersRanking]
        .sort((a, b) => Math.abs(b.points - playerPoints) - Math.abs(a.points - playerPoints))
        .slice(0, 4)
        .map(calculateOpponentPoints);

      // Worst case: players with least points difference (fewer points to win)
      const worstCase = [...opponentPlayersRanking]
        .sort((a, b) => Math.abs(a.points - playerPoints) - Math.abs(b.points - playerPoints))
        .slice(0, 4)
        .map(calculateOpponentPoints);

      return {
        matchId: nextMatch.MatchId,
        date: nextMatch.Date,
        homeTeam: `${nextMatch.HomeClub} ${nextMatch.HomeTeam}`,
        awayTeam: `${nextMatch.AwayClub} ${nextMatch.AwayTeam}`,
        bestCase,
        worstCase,
      };
    } catch (error) {
      console.error('Error getting next match estimation:', error);
      return undefined;
    }
  }

  private getRankingPoints(ranking: string, category: PlayerCategoryDTO): number {
    // Get base points for each ranking from the ranking estimation tables
    const estimationTable = category === PlayerCategoryDTO.SENIOR_MEN 
      ? MEN_RANKING_ESTIMATION['15000'] 
      : WOMAN_RANKING_ESTIMATION['15000'];
    
    return estimationTable[ranking] || 0;
  }
}
