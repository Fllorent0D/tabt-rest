import { Injectable } from '@nestjs/common';
import { PlayerCategory, Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';

export type IndividualResultWithOpponent = Prisma.IndividualResultGetPayload<{
  include: {
    memberOpponent: true;
  };
}>;

@Injectable()
export class DataAFTTIndividualResultModel {
  constructor(private readonly prismaService: PrismaService) {}

  async getResults(
    licence: number,
    playerCategory: PlayerCategory,
  ): Promise<IndividualResultWithOpponent[]> {
    return this.prismaService.individualResult.findMany({
      where: {
        memberLicence: licence,
        member: {
          playerCategory,
        },
      },
      include: {
        memberOpponent: true,
      },
    });
  }
}
