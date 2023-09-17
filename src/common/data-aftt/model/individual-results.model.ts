import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { Gender, IndividualResult, Member } from "@prisma/client";

@Injectable()
export class DataAFTTIndividualResultModel {
    constructor(
        private readonly prismaService: PrismaService
    ) {
    }

    async upsert(
        result: Omit<Omit<IndividualResult, 'memberId'>, 'opponentId'>,
        gender: Gender
    ): Promise<IndividualResult> {

        const [member, opponent]: Member[] = await Promise.all([
            this.prismaService.member.findFirst({
                where: {
                    licence: result.memberLicence,
                    gender
                }
            }),
            this.prismaService.member.findFirst({
                where: {
                    licence: result.opponentLicence,
                    gender,
                }
            })
        ]);

        return this.prismaService.individualResult.upsert({
            where: {
                id: result.id
            },
            update: {
                member: {
                    connect: {
                        id_licence: {
                            id: member.id,
                            licence: member.licence
                        }
                    }
                },
                memberOpponent: {
                    connect: {
                        id_licence: {
                            id: opponent.id,
                            licence: opponent.licence
                        }
                    }
                }
            },
            create: {
                id: result.id,
                date: result.date,
                competitionType: result.competitionType,
                score: result.score,
                memberRanking: result.memberRanking,
                memberPoints: result.memberPoints,
                opponentRanking: result.opponentRanking,
                opponentPoints: result.opponentPoints,
                competitionCoef: result.competitionCoef,
                competitionName: result.competitionName,
                result: result.result,
                definitivePointsToAdd: result.definitivePointsToAdd,
                diffPoints: result.diffPoints,
                looseFactor: result.looseFactor,
                pointsToAdd: result.pointsToAdd,
                member: {
                    connect: {
                        id_licence: {
                            id: member.id,
                            licence: member.licence
                        }
                    }
                },
                memberOpponent: {
                    connect: {
                        id_licence: {
                            id: opponent.id,
                            licence: opponent.licence
                        }
                    }
                }
            }
        });
    }


}