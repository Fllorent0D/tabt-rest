import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { Gender, NumericPoints } from "@prisma/client";
import { BepingNotifierService } from '../../../services/notifications/beping-notifier.service';

@Injectable()
export class DataAFTTMemberNumericRankingModel {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly bepingNotifierService: BepingNotifierService
    ) {
    }


    getLatestPoints(licence: number, gender: Gender): Promise<NumericPoints[]> {
        const points = this.prismaService.numericPoints.findMany({
            where: {
                memberLicence: licence,
                member: {
                    gender
                }
            },
            orderBy: {
                date: 'asc'
            }
        });
        return points;
    }


    async insertInHistory(points: NumericPoints): Promise<NumericPoints> {
        // get latest point for member
        // if latest point is different from current point, insert new point. I want to keen track of the evolution of the points
        // else do nothing
        if(!points.points){
            throw new Error(`No points for ${points.memberId} - ${points.memberLicence}`);
        }

        const latestPoint = await this.prismaService.numericPoints.findFirst({
            where: {
                memberId: points.memberId,
                memberLicence: points.memberLicence
            },
            orderBy: {
                date: 'desc'
            }
        });
        
        if(latestPoint?.points !== points.points || latestPoint?.ranking !== points.ranking){
            // push a notification to player
            await this.bepingNotifierService.notifyNumericRankingChanged(points.memberLicence, latestPoint?.ranking, points.ranking)

            return this.prismaService.numericPoints.create({
                data: {
                    points: points.points,
                    ranking: points.ranking,
                    date: points.date,
                    rankingLetterEstimation: points.rankingLetterEstimation,
                    rankingWI: points.rankingWI,
                    member: {
                        connect: {
                            id_licence: {
                                id: points.memberId,
                                licence: points.memberLicence
                            }
                        }
                    }
                }
            });
        }

    }
}
