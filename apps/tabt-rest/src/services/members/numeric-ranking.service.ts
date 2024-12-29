import { Injectable } from '@nestjs/common';

import { CompetitionType, NumericPoints, PlayerCategory as pc } from '@prisma/client';
import { format } from 'date-fns';

import { CacheService, TTL_DURATION } from '../../common/cache/cache.service';
import { DataAFTTMemberNumericRankingModel } from './member-numeric-ranking.model';
import {
  COMPETITION_TYPE,
  NumericRankingDetailsV3,
  WeeklyNumericRankingV4,
  WeeklyNumericRankingV5,
} from '../../api/member/dto/member.dto';
import { PlayerCategory } from '../../entity/tabt-input.interface';
import { DataAFTTIndividualResultModel, IndividualResultWithOpponent } from './individual-results.model';
import { ConfigService } from '@nestjs/config';
import { PlayerCategoryDTO } from '../../common/dto/player-category.dto';

@Injectable()
export class NumericRankingService {
  constructor(
    private readonly memberNumericRankingModel: DataAFTTMemberNumericRankingModel,
    private readonly resultHistoryModel: DataAFTTIndividualResultModel,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {
  }

  async getWeeklyRankingV4(
    licence: number,
    playerCategory: PlayerCategoryDTO,
  ): Promise<WeeklyNumericRankingV4> {
    const getter = async (): Promise<WeeklyNumericRankingV4> => {
      const [history, actualPoints] = await Promise.all([
        this.getResultsDetailsHistory(licence, playerCategory),
        this.getActualPointsV3(licence, playerCategory),
      ]);
      const points = history
        .map((d) => ({
          weekName: d.date,
          points: d.endPoints,
        }))
        .reverse();
      const lastBasePoints =
        history[history.length - 1]?.basePoints ?? actualPoints;
      //insert in first position in array points

      const currentSeason = this.configService.get<number>('CURRENT_SEASON');
      points.unshift({
        weekName: `20${currentSeason - 1}-07-01`,
        points: lastBasePoints,
      });

      return {
        perDateHistory: history,
        points: points,
        actualPoints: actualPoints,
      };
    };
    return this.cacheService.getFromCacheOrGetAndCacheResult(
      `numeric-ranking-v4:${licence}:${playerCategory}`,
      getter,
      TTL_DURATION.ONE_DAY,
    );
  }

  async getActualPointsV3(
    licence: number,
    playerCategory: PlayerCategoryDTO,
  ): Promise<number> {
    const gender =
      playerCategory === PlayerCategoryDTO.SENIOR_MEN ? pc.MEN : pc.WOMEN;
    const points = await this.memberNumericRankingModel.getLatestPoints(
      licence,
      gender,
    );
    return points[points.length - 1]?.points ?? 0;
  }

  async getWeeklyRankingV5(
    licence: number,
    category: PlayerCategoryDTO,
  ): Promise<WeeklyNumericRankingV5> {
    const getter = async (): Promise<WeeklyNumericRankingV5> => {
      const [history, actualPoints] = await Promise.all([
        this.getResultsDetailsHistory(licence, category),
        this.getActualPoints(licence, category),
        this.getRankingEstimation(licence, category),
      ]);
      const points = history
        .map((d) => ({
          weekName: d.date,
          points: d.endPoints,
        }))
        .reverse();
      const lastBasePoints =
        history[history.length - 1]?.basePoints ??
        actualPoints[actualPoints.length - 1]?.points ?? 0;
      //insert in first position in array points

      const currentSeason = this.configService.get<number>('CURRENT_SEASON');
      points.unshift({
        weekName: `20${currentSeason - 1}-07-01`,
        points: lastBasePoints,
      });

      return {
        perDateHistory: history,
        numericRankingHistory: actualPoints.map((p) => ({
          ranking: p.rankingWI,
          rankingLetterEstimation: p.rankingLetterEstimation,
          points: p?.points ?? 0,
          date: p.date.toISOString(),
        })),
      };
    };
    return this.cacheService.getFromCacheOrGetAndCacheResult(
      `numeric-ranking-v5:${licence}:${category}`,
      getter,
      TTL_DURATION.ONE_DAY,
    );
  }

  async getActualPoints(
    licence: number,
    category: PlayerCategoryDTO,
  ): Promise<NumericPoints[]> {
    const gender =
      category === PlayerCategoryDTO.SENIOR_MEN ? pc.MEN : pc.WOMEN;
    return await this.memberNumericRankingModel.getLatestPoints(
      licence,
      gender,
    );
  }

  async getResultsDetailsHistory(
    licence: number,
    category: PlayerCategoryDTO,
  ): Promise<NumericRankingDetailsV3[]> {
    const gender =
      category === PlayerCategoryDTO.SENIOR_MEN ? pc.MEN : pc.WOMEN;
    const results = await this.resultHistoryModel.getResults(licence, gender);

    // group result per date and comptetition name
    // then for each group, map the points

    const eventGrouped: { [key: string]: IndividualResultWithOpponent[] } =
      results.reduce<{
        [key: string]: IndividualResultWithOpponent[];
      }>((acc, result: IndividualResultWithOpponent) => {
        const key = `${format(result.date, 'yyyy-MM-dd')}-${result.competitionName}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(result);
        return acc;
      }, {});
    const objectKeys = Object.keys(eventGrouped).sort();
    const eventGroupedArray: NumericRankingDetailsV3[] = [];
    for (const key of objectKeys) {
      const date = eventGrouped[key][0].date;
      const competitionContext = eventGrouped[key][0].competitionName;
      const competitionType =
        eventGrouped[key][0].competitionType === CompetitionType.TOURNAMENT
          ? COMPETITION_TYPE.TOURNAMENT
          : COMPETITION_TYPE.CHAMPIONSHIP;
      const opponents = eventGrouped[key].map((result) => ({
        opponentName:
          result.memberOpponent.firstname +
          ' ' +
          result.memberOpponent.lastname,
        opponentRanking: result.opponentRanking,
        opponentUniqueIndex: result.opponentLicence,
        opponentNumericRanking: result.opponentPoints,
        pointsWon: result.definitivePointsToAdd,
        score: result.score,
      }));
      let basePoints = 0;
      const currentKeyIndex = objectKeys.indexOf(key);
      if (currentKeyIndex > 0) {
        const previousGroup = eventGroupedArray[currentKeyIndex - 1];
        basePoints = previousGroup.endPoints;
      } else {
        basePoints = eventGrouped[objectKeys[0]][0].memberPoints;
      }
      const endPoints = eventGrouped[key].reduce(
        (acc, result) => acc + result.definitivePointsToAdd,
        basePoints,
      );
      eventGroupedArray.push({
        date: format(date, 'yyyy-MM-dd'),
        competitionContext,
        competitionType,
        basePoints: Math.round(basePoints * 100) / 100,
        endPoints: Math.round(endPoints * 100) / 100,
        opponents,
      });
    }

    return eventGroupedArray.reverse();
  }

  private getRankingEstimation(
    licence: number,
    category: PlayerCategoryDTO,
  ) {
  }
}
