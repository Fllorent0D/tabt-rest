import { Injectable } from '@nestjs/common';
import { DataAFTTMemberNumericRankingModel } from '../model/member-numeric-ranking.model';
import {
  COMPETITION_TYPE,
  NumericRankingDetailsV3,
  WeeklyNumericPointsV3,
  WeeklyNumericRankingV4,
} from '../../../api/member/dto/member.dto';
import { SimplifiedPlayerCategory } from '../../../api/member/helpers/player-category-helpers';
import { PlayerCategory } from '../../../entity/tabt-input.interface';
import { CompetitionType, Gender } from '@prisma/client';
import { format } from 'date-fns';
import { DataAFTTIndividualResultModel, IndividualResultWithOpponent } from '../model/individual-results.model';

@Injectable()
export class NumericRankingService {
  constructor(
    private readonly memberNumericRankingModel: DataAFTTMemberNumericRankingModel,
    private readonly resultHistoryModel: DataAFTTIndividualResultModel,
  ) {
  }

  async getWeeklyRanking(licence: number, simplifiedCategory: SimplifiedPlayerCategory): Promise<WeeklyNumericRankingV4> {
    const [points, history] = await Promise.all([
      this.getRankingHistory(licence, simplifiedCategory),
      this.getResultsDetailsHistory(licence, simplifiedCategory),
    ]);

    return {
      perDateHistory: history,
      points: points,
      actualPoints: points[points.length - 1].points,
    };
  }


  async getRankingHistory(licence: number, simplifiedCategory: SimplifiedPlayerCategory): Promise<WeeklyNumericPointsV3[]> {
    const gender = simplifiedCategory === PlayerCategory.MEN ? Gender.MEN : Gender.WOMEN;
    const points = await this.memberNumericRankingModel.getLatestPoints(licence, gender);
    return points.map(p => ({
      weekName: format(p.date, 'yyyy-MM-dd'),
      points: p.points,
    }));
  }

  async getResultsDetailsHistory(licence: number, simplifiedCategory: SimplifiedPlayerCategory): Promise<NumericRankingDetailsV3[]> {
    const gender = simplifiedCategory === PlayerCategory.MEN ? Gender.MEN : Gender.WOMEN;
    const results = await this.resultHistoryModel.getResults(licence, gender);

    // group result per date and comptetition name
    // then for each group, map the points

    const eventGrouped: { [key: string]: IndividualResultWithOpponent[] } = results.reduce<{
      [key: string]: IndividualResultWithOpponent[]
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
      const competitionType = eventGrouped[key][0].competitionType === CompetitionType.TOURNAMENT ? COMPETITION_TYPE.TOURNAMENT : COMPETITION_TYPE.CHAMPIONSHIP;
      const opponents = eventGrouped[key].map(result => ({
        opponentName: result.memberOpponent.firstname + ' ' + result.memberOpponent.lastname,
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
      const endPoints = eventGrouped[key].reduce((acc, result) => acc + result.definitivePointsToAdd, basePoints);
      eventGroupedArray.push({
        date: format(date, 'yyyy-MM-dd'),
        competitionContext,
        competitionType,
        basePoints,
        endPoints,
        opponents,
      });
    }

    return eventGroupedArray.reverse();

  }


}
