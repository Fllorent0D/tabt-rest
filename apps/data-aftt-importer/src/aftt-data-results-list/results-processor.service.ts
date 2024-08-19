import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';
import {
  CompetitionType,
  Member,
  PlayerCategory,
  Result,
} from '@prisma/client';
import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../prisma.service';
import { CacheService } from '../cache/cache.service';

@Processor('results')
export class ResultsProcessorService {
  private readonly logger = new Logger(ResultsProcessorService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService
  ) {
    console.log('ResultsProcessorService constructor');
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  
  }

  @Process()
  async process(job: Job<{ playerCategory: PlayerCategory }>): Promise<void> {
    this.logger.log('Processing results...');
    const lines = await this.downloadMemberLines(job.data.playerCategory);

    const chunkSize = 100;
    for (let i = 0; i < lines.length; i += chunkSize) {
      this.logger.debug(
        `Processing chunk ${i / chunkSize + 1}/${Math.ceil(lines.length / chunkSize)}...`,
      );

      const chunk = lines.slice(i, i + chunkSize);

      // Process each chunk in parallel
      await Promise.all(
        chunk.map((line) => {
          const cols = line.split(';');
          return this.updateDB(cols, job.data.playerCategory);
        }),
      );

      await this.cacheService.cleanKeys(`numeric-ranking-v4:*:${job.data.playerCategory == PlayerCategory.MEN ? 1 : 2}`)

    }

    this.logger.log(`Processing done. (${lines.length} lines)`);
  }

  private async downloadMemberLines(playerCategory: PlayerCategory) {
    this.logger.debug(
      `Downloading ${playerCategory} results file from data.aftt.be`,
    );

    const file = await firstValueFrom(
      this.httpService.get<string>(
        `export/liste_result_${playerCategory == PlayerCategory.MEN ? 1 : 2}.txt`,
      ),
    );
    const lines = file.data.split('\n').slice(0, -1);
    this.logger.debug(
      `File downloaded, start processing ${lines.length} lines...`,
    );
    return lines;
  }

  private async updateDB(cols: string[], playerCategory: PlayerCategory) {
    try {
      const result = {
        id: parseInt(cols[0], 10),
        date: new Date(cols[1]),
        memberRanking: cols[10],
        memberPoints: parseFloat(cols[13]),
        opponentRanking: cols[8],
        opponentPoints: parseFloat(cols[14]),
        result: cols[4] === 'V' ? Result.VICTORY : Result.DEFEAT,
        score: cols[5],
        competitionType:
          cols[9] === 'T'
            ? CompetitionType.TOURNAMENT
            : CompetitionType.CHAMPIONSHIP,
        competitionCoef: parseFloat(cols[11]),
        competitionName: cols[12],
        diffPoints: cols[15]?.length ? parseFloat(cols[15]) : 0,
        pointsToAdd: cols[16]?.length ? parseFloat(cols[16]) : 0,
        looseFactor: cols[17]?.length ? parseFloat(cols[17]) : 0,
        definitivePointsToAdd: cols[18]?.length ? parseFloat(cols[18]) : 0,
        playerCategory: playerCategory,
      };

      // check if result has changed
      const existingResult =
        await this.prismaService.individualResult.findUnique({
          where: {
            id_playerCategory: {
              id: result.id,
              playerCategory: playerCategory,
            },
          },
        });

      // deep equal
      if (
        existingResult &&
        existingResult.competitionCoef === result.competitionCoef &&
        existingResult.competitionName === result.competitionName &&
        existingResult.competitionType === result.competitionType &&
        existingResult.definitivePointsToAdd === result.definitivePointsToAdd &&
        existingResult.diffPoints === result.diffPoints &&
        existingResult.looseFactor === result.looseFactor &&
        existingResult.memberPoints === result.memberPoints &&
        existingResult.memberRanking === result.memberRanking &&
        existingResult.opponentPoints === result.opponentPoints &&
        existingResult.opponentRanking === result.opponentRanking &&
        existingResult.result === result.result &&
        existingResult.score === result.score &&
        existingResult.pointsToAdd === result.pointsToAdd
      ) {
        return;
      }

      const memberLicence = parseInt(cols[2], 10);
      const opponentLicence = parseInt(cols[3], 10);
      const [member, opponent]: Member[] = await Promise.all([
        this.prismaService.member.findFirst({
          where: {
            licence: memberLicence,
            playerCategory: playerCategory,
          },
        }),
        this.prismaService.member.findFirst({
          where: {
            licence: opponentLicence,
            playerCategory: playerCategory,
          },
        }),
      ]);

      if (!member || !opponent) {
        this.logger.error(
          `Member or opponent not found for result ${result.id}`,
        );
        return;
      }

      await this.prismaService.individualResult.upsert({
        where: {
          id_playerCategory: {
            id: result.id,
            playerCategory: playerCategory,
          },
        },
        update: {
          ...result,
          member: {
            connect: {
              id_licence: {
                id: member.id,
                licence: member.licence,
              },
            },
          },
          memberOpponent: {
            connect: {
              id_licence: {
                id: opponent.id,
                licence: opponent.licence,
              },
            },
          },
        },
        create: {
          ...result,
          member: {
            connect: {
              id_licence: {
                id: member.id,
                licence: member.licence,
              },
            },
          },
          memberOpponent: {
            connect: {
              id_licence: {
                id: opponent.id,
                licence: opponent.licence,
              },
            },
          },
        },
      });
    } catch (e) {
      this.logger.error(e.message);
    }
  }
}
