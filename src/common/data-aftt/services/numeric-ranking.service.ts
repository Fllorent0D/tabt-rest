import { Injectable } from "@nestjs/common";
import { DataAFTTMemberNumericRankingModel } from "../model/member-numeric-ranking.model";
import { COMPETITION_TYPE, NumericRankingDetailsV3, PLAYER_CATEGORY, WeeklyNumericPointsV3, WeeklyNumericRankingV4 } from "src/api/member/dto/member.dto";
import { SimplifiedPlayerCategory } from "src/api/member/helpers/player-category-helpers";
import { PlayerCategory } from "src/entity/tabt-input.interface";
import { CompetitionType, Gender, IndividualResult } from "@prisma/client";
import { format } from "date-fns";
import { DataAFTTIndividualResultModel, IndividualResultWithOpponent } from "../model/individual-results.model";
import { IndividualMatchResult } from "src/entity/tabt-soap/TabTAPI_Port";

@Injectable()
export class NumericRankingService {
    constructor(
        private readonly memberNumericRankingModel: DataAFTTMemberNumericRankingModel,
        private readonly resultHistoryModel: DataAFTTIndividualResultModel
    ) {
    }

    async getWeeklyRanking(licence: number, simplifiedCategory: SimplifiedPlayerCategory): Promise<WeeklyNumericRankingV4> {
        const [points, history] = await Promise.all([
            this.getRankingHistory(licence, simplifiedCategory),
            this.getResultsDetailsHistory(licence, simplifiedCategory)
        ]);

        return {
            perDateHistory: history,
            points: points,
        }
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

        const eventGrouped: {[key: string]: IndividualResultWithOpponent[]} = results.reduce<{[key: string]: IndividualResultWithOpponent[]}>((acc, result: IndividualResultWithOpponent) => {
            const key = `${result.date}-${result.competitionName}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(result);
            return acc;
        }, {});

        const eventGroupedArray: NumericRankingDetailsV3[] = Object.keys(eventGrouped).map(key => {
            const date = eventGrouped[key][0].date;
            const competitionContext = eventGrouped[key][0].competitionName;
            const competitionType = eventGrouped[key][0].competitionType === CompetitionType.TOURNAMENT ? COMPETITION_TYPE.TOURNAMENT : COMPETITION_TYPE.CHAMPIONSHIP;
            const opponents = eventGrouped[key].map(result => ({
                opponentName: result.memberOpponent.firstname + ' ' + result.memberOpponent.lastname,
                opponentRanking: result.opponentRanking,
                opponentNumericRanking: result.opponentPoints,
                pointsWon: result.definitivePointsToAdd,
                score: result.score,
            }));
            const basePoints = eventGrouped[key][0].memberPoints;
            const endPoints = eventGrouped[key].reduce((acc, result) => acc + result.definitivePointsToAdd, eventGrouped[key][0].memberPoints);
            return {
                date: format(date, 'yyyy-MM-dd'),
                competitionContext,
                competitionType,
                basePoints,
                endPoints,
                opponents,
            }
        });

        return eventGroupedArray;

    }


}
