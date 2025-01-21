import { Injectable } from '@nestjs/common';
import { PlayerCategory } from '@prisma/client';
import { CacheService, TTL_DURATION } from '../../common/cache/cache.service';
import { PlayerCategoryDTO } from '../../common/dto/player-category.dto';
import { PrismaService } from '../../common/prisma.service';
import { MEN_RANKING_ESTIMATION, WOMAN_RANKING_ESTIMATION } from '../../common/consts/ranking-estimation';

@Injectable()
export class RankingDistributionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService,
  ) {}

  async getMembersWithRankingCount(
    category: PlayerCategoryDTO = PlayerCategoryDTO.SENIOR_MEN,
  ): Promise<number> {
    return this.cacheService.getFromCacheOrGetAndCacheResult(
      `members-with-ranking-${category}`,
      async () => {

    /*
    SELECT COUNT(*)
from public."NumericPoints" n
INNER join public."Member" m
ON n."memberId" = m.id
WhERE m."playerCategory" = 'SENIOR_MEN' AND n."ranking" IS NOT NULL and n.date = (
  SELECT date
  from public."NumericPoints" n1
  order by n1.date DESC
  LIMIT 1
)
*/

        return this.prismaService.numericPoints.count({
          where: {
            member: {
              playerCategory: category === PlayerCategoryDTO.SENIOR_MEN ? PlayerCategory.SENIOR_MEN : PlayerCategory.SENIOR_WOMEN,
            },
            ranking: {
              not: null,
            },
            date: {
              equals: (await this.prismaService.numericPoints.findFirst({
                orderBy: { date: 'desc' },
              }))?.date,
            },
          },
        });
      },
      TTL_DURATION.ONE_DAY,
    );
  }

  getRankingTable(totalPlayers: number, category: PlayerCategoryDTO): Record<string, number> {
    // Get the estimation table based on category
    const estimationTable = category === PlayerCategoryDTO.SENIOR_MEN ? MEN_RANKING_ESTIMATION : WOMAN_RANKING_ESTIMATION;
    
    // Get all available player counts and find the highest one that's lower than or equal to totalPlayers
    const availableCounts = Object.keys(estimationTable)
      .map(Number)
      .sort((a, b) => b - a); // Sort in descending order
    
    const selectedCount = availableCounts.find(count => count <= totalPlayers) || 14000;
    
    return estimationTable[selectedCount.toString()];
  }


  async getLetterRankingEstimationFromNumericPoints(ranking: number, category: PlayerCategoryDTO): Promise<string> {
    const totalPlayers = await this.getMembersWithRankingCount(category);
    const rankingTable = this.getRankingTable(totalPlayers, category);
    return Object.entries(rankingTable)
      .find(([_, threshold]) => ranking <= threshold)?.[0] || 'NC';

  }
} 
