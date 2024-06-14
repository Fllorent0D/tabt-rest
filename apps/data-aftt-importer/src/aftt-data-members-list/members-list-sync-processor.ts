import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';
import { Member, NumericPoints, PlayerCategory } from '@prisma/client';
import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { PrismaService } from '../prisma.service';
import { Job } from 'bull';

@Processor('members')
export class MembersListProcessingService {
  private readonly logger = new Logger(MembersListProcessingService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`Processing job ${job.id} of type with data ${job.data}...`);
  }

  @Process()
  async process(job: Job<{ playerCategory: PlayerCategory }>): Promise<void> {
    const file = await this.downloadFile(job.data.playerCategory);
    // split lines and remove last line
    const lines = file.split('\n').slice(0, -1);

    this.logger.log(
      `File downloaded, start processing ${lines.length} lines...`,
    );
    for (const line of lines) {
      await this.processLine(line, job.data.playerCategory);
    }
    this.logger.log(`Processing done. (${lines.length} lines)`);
  }

  private async processLine(line: string, playerCategory: PlayerCategory) {
    const cols = line.split(';');
    try {
      /*
        17;
        519190;
        GERTENBACH;
        ANGELIQUE;
        B2;
        5 - A062;
        6 - 0;
        7 - SEN;
        8 - 999;
        9 - NL;
        10 - 2205
        Ranking_Pos 11 - ;
        Ranking_Pos_WI - 12 - ;
        RankingAn - 13 - 153;
        */
      const member: Member = {
        id: parseInt(cols[0], 10),
        licence: parseInt(cols[1], 10),
        playerCategory: playerCategory,
        firstname: cols[3],
        lastname: cols[2],
        ranking: cols[4],
        club: cols[5],
        category: cols[7],
        worldRanking: parseInt(cols[8], 10),
        nationality: cols[9],
      };

      const numericPoints = {
        memberId: parseInt(cols[0], 10),
        memberLicence: parseInt(cols[1], 10),
        date: new Date(),
        points: parseFloat(cols[10]),
        ranking: cols[11].length ? parseInt(cols[11]) : null,
        rankingWI: cols[12].length ? parseInt(cols[12]) : null,
        rankingLetterEstimation: null,
      };

      await this.updateMemberInfo(member);
      await this.addNumericPointsToHistory(numericPoints);
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  private async downloadFile(playerCategory: PlayerCategory): Promise<string> {
    this.logger.log(`Downloading ${playerCategory} file from data.aftt.be`);
    const file = await firstValueFrom(
      this.httpService.get<string>(
        `export/liste_joueurs_${playerCategory == PlayerCategory.MEN ? 1 : 2}.txt`,
      ),
    );
    return file.data;
  }

  private async updateMemberInfo(member: Member) {
    if (!member.licence) {
      throw new Error(`No licence for ${member.lastname} ${member.firstname}`);
    }

    if (!member.id) {
      throw new Error(`No id for ${member.licence}`);
    }

    try {
      const existingMember = await this.prismaService.member.findFirst({
        where: {
          id: member.id,
          licence: member.licence,
          playerCategory: member.playerCategory,
        },
      });

      if (existingMember) {
        if (JSON.stringify(existingMember) === JSON.stringify(member)) {
          this.logger.log(`Member ${member.licence} already processed`);
        } else {
          this.logger.debug(
            `Member ${member.licence} already exists but with different info, updating...`,
          );
          await this.prismaService.member.update({
            where: {
              id_licence: {
                id: member.id,
                licence: member.licence,
              },
            },
            data: member,
          });
        }
      } else {
        this.logger.log(`New member ${member.licence}`);
        await this.prismaService.member.create({
          data: member,
        });
      }
    } catch (e) {
      this.logger.log(`Error when processing member ${member.licence}`);
    }
  }

  private async addNumericPointsToHistory(numericPoints: NumericPoints) {
    // get latest point for member
    // if latest point is different from current point, insert new point. I want to keen track of the evolution of the points
    // else do nothing
    try {
      if (!numericPoints.points) {
        throw new Error(`No points for ${numericPoints.memberLicence}`);
      }

      const latestPoint = await this.prismaService.numericPoints.findFirst({
        where: {
          memberId: numericPoints.memberId,
          memberLicence: numericPoints.memberLicence,
        },
        orderBy: {
          date: 'desc',
        },
      });

      if (
        latestPoint?.points !== numericPoints.points ||
        latestPoint?.ranking !== numericPoints.ranking
      ) {
        // TODO: push a notification to player on redis
        this.logger.log(`New points for ${numericPoints.memberLicence}`);
        await this.prismaService.numericPoints.create({
          data: {
            points: numericPoints.points,
            ranking: numericPoints.ranking,
            date: numericPoints.date,
            rankingLetterEstimation: numericPoints.rankingLetterEstimation,
            rankingWI: numericPoints.rankingWI,
            member: {
              connect: {
                id_licence: {
                  id: numericPoints.memberId,
                  licence: numericPoints.memberLicence,
                },
              },
            },
          },
        });
      } else {
        this.logger.log(
          `Points of member ${numericPoints.memberLicence} already processed. No new points.`,
        );
      }
    } catch (e) {
      this.logger.error(
        `Error when processing points for ${numericPoints.memberLicence}`,
      );
    }
  }
}
