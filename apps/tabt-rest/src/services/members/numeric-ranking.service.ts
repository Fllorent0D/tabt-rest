import { Injectable } from '@nestjs/common';

import { CompetitionType, PlayerCategory as pc } from '@prisma/client';
import { format } from 'date-fns';

import { CacheService, TTL_DURATION } from '../../common/cache/cache.service';
import { DataAFTTMemberNumericRankingModel } from './member-numeric-ranking.model';
import { SimplifiedPlayerCategory } from '../../api/member/helpers/player-category-helpers';
import {
  COMPETITION_TYPE,
  NumericRankingDetailsV3,
  WeeklyNumericRankingV4,
} from '../../api/member/dto/member.dto';
import { PlayerCategory } from '../../entity/tabt-input.interface';
import {
  DataAFTTIndividualResultModel,
  IndividualResultWithOpponent,
} from './individual-results.model';

@Injectable()
export class NumericRankingService {
  constructor(
    private readonly memberNumericRankingModel: DataAFTTMemberNumericRankingModel,
    private readonly resultHistoryModel: DataAFTTIndividualResultModel,
    private readonly cacheService: CacheService,
  ) {}

  async getWeeklyRanking(
    licence: number,
    simplifiedCategory: SimplifiedPlayerCategory,
  ): Promise<WeeklyNumericRankingV4> {
    const getter = async (): Promise<WeeklyNumericRankingV4> => {
      const [history, actualPoints] = await Promise.all([
        this.getResultsDetailsHistory(licence, simplifiedCategory),
        this.getActualPoints(licence, simplifiedCategory),
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

      // TO DO change
      points.unshift({
        weekName: '2024-07-01',
        points: lastBasePoints,
      });

      return {
        perDateHistory: history,
        points: points,
        actualPoints: actualPoints,
      };
    };
    return this.cacheService.getFromCacheOrGetAndCacheResult(
      `numeric-ranking-v4:${licence}:${simplifiedCategory}`,
      getter,
      TTL_DURATION.ONE_DAY,
    );
  }

  async getActualPoints(
    licence: number,
    simplifiedCategory: SimplifiedPlayerCategory,
  ): Promise<number> {
    const gender =
      simplifiedCategory === PlayerCategory.MEN ? pc.MEN : pc.WOMEN;
    const points = await this.memberNumericRankingModel.getLatestPoints(
      licence,
      gender,
    );
    return points[points.length - 1].points;
  }

  async getResultsDetailsHistory(
    licence: number,
    simplifiedCategory: SimplifiedPlayerCategory,
  ): Promise<NumericRankingDetailsV3[]> {
    const gender =
      simplifiedCategory === PlayerCategory.MEN ? pc.MEN : pc.WOMEN;
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
}
