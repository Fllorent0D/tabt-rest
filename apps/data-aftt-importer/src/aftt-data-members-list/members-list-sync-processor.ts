import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';
import { Member, NumericPoints, PlayerCategory, ImportType } from '@prisma/client';
import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { PrismaService } from '../prisma.service';
import { Job } from 'bull';
import { CacheService } from '../cache/cache.service';
import { createHash } from 'crypto';

const BATCH_SIZE = 100;
const UPDATE_CHUNK_SIZE = 10;
const POINTS_BATCH_SIZE = 100;
const TRANSACTION_TIMEOUT = 120000;

@Processor('members')
export class MembersListProcessingService {
  private readonly logger = new Logger(MembersListProcessingService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Processing job ${job.id} with data ${job.data}...`);
  }

  @Process()
  async process(job: Job<{ playerCategory: PlayerCategory }>): Promise<void> {
    try {
      const lines = await this.downloadAndPrepareFile(job.data.playerCategory);
      const { changedLines } = await this.filterChangedLines(lines, job.data.playerCategory);
      
      if (changedLines.length === 0) {
        this.logger.log('No changes detected in the file, skipping processing');
        return;
      }
      
      this.logger.log(`Processing ${changedLines.length} changed lines out of ${lines.length} total lines`);
      await this.processBatches(changedLines, job.data.playerCategory);
      await this.cleanCache(job.data.playerCategory);
      
      // Store the new import record
      await this.storeImport(lines, job.data.playerCategory);
    } catch (e) {
      this.logger.error("Failed to finish job", e.message);
      throw e;
    }
  }

  private async downloadAndPrepareFile(playerCategory: PlayerCategory): Promise<string[]> {
    this.logger.debug(`Downloading ${playerCategory} file from data.aftt.be`);
    const file = await firstValueFrom(
      this.httpService.get<string>(
        `export/liste_joueurs_${playerCategory === PlayerCategory.SENIOR_MEN ? 1 : 2}.txt`,
      ),
    );
    const lines = file.data.split('\n').slice(0, -1);
    this.logger.log(`File downloaded, processing ${lines.length} lines...`);
    return lines;
  }

  private async processBatches(lines: string[], playerCategory: PlayerCategory): Promise<void> {
    for (let i = 0; i < lines.length; i += BATCH_SIZE) {
      const batch = lines.slice(i, i + BATCH_SIZE);
      await this.processBatch(batch, playerCategory);
      this.logger.debug(`Processed batch ${i / BATCH_SIZE + 1} of ${Math.ceil(lines.length / BATCH_SIZE)}`);
    }
    this.logger.log(`Processing done. (${lines.length} lines)`);
  }

  private async cleanCache(playerCategory: PlayerCategory): Promise<void> {
    const categoryId = playerCategory === PlayerCategory.SENIOR_MEN ? 1 : 2;
    await this.cacheService.cleanKeys(`numeric-ranking-v4:*:${categoryId}`);
  }

  private async processBatch(lines: string[], playerCategory: PlayerCategory) {
    const { membersToUpsert, pointsToCreate } = this.parseLines(lines, playerCategory);
    await this.processMembers(membersToUpsert);
    await this.processPoints(pointsToCreate);
  }

  private parseLines(lines: string[], playerCategory: PlayerCategory) {
    const membersToUpsert: Member[] = [];
    const pointsToCreate: NumericPoints[] = [];

    for (const line of lines) {
      try {
        const { member, numericPoints } = this.parseLine(line, playerCategory);
        membersToUpsert.push(member);
        if (numericPoints.points) {
          pointsToCreate.push(numericPoints);
        }
      } catch (e) {
        this.logger.error(`Failed to parse line: ${line}`, e.message);
      }
    }

    return { membersToUpsert, pointsToCreate };
  }

  private async processMembers(members: Member[]) {
    const startTime = Date.now();
    await this.prismaService.$transaction(async (tx) => {
      await tx.$executeRaw`
        INSERT INTO "Member" (
          id, licence, "playerCategory", firstname, lastname, ranking, 
          club, category, "worldRanking", nationality, email, 
          "createdAt", "updatedAt"
        )
        SELECT * FROM UNNEST(
          ${members.map(m => m.id)}::integer[],
          ${members.map(m => m.licence)}::integer[],
          ${members.map(m => m.playerCategory)}::"PlayerCategory"[],
          ${members.map(m => m.firstname)}::text[],
          ${members.map(m => m.lastname)}::text[],
          ${members.map(m => m.ranking)}::text[],
          ${members.map(m => m.club)}::text[],
          ${members.map(m => m.category)}::text[],
          ${members.map(m => m.worldRanking)}::integer[],
          ${members.map(m => m.nationality)}::text[],
          ${members.map(m => m.email)}::text[],
          ${members.map(() => new Date())}::timestamp[],
          ${members.map(() => new Date())}::timestamp[]
        )
        ON CONFLICT (id, licence) DO UPDATE SET
          "playerCategory" = EXCLUDED."playerCategory",
          firstname = EXCLUDED.firstname,
          lastname = EXCLUDED.lastname,
          ranking = EXCLUDED.ranking,
          club = EXCLUDED.club,
          category = EXCLUDED.category,
          "worldRanking" = EXCLUDED."worldRanking",
          nationality = EXCLUDED.nationality,
          "updatedAt" = EXCLUDED."updatedAt"
      `;
    }, { timeout: TRANSACTION_TIMEOUT, maxWait: TRANSACTION_TIMEOUT });
    
    this.logger.debug(`Processed ${members.length} members in ${Date.now() - startTime}ms`);
  }

  private async findExistingMembers(tx: any, members: Member[]) {
    return tx.member.findMany({
      where: {
        OR: members.map(m => ({
          AND: [{ id: m.id }, { licence: m.licence }]
        }))
      },
      select: { id: true, licence: true },
    });
  }

  private splitMembersForUpsert(members: Member[], existingMembers: any[]) {
    const existingMap = new Map(
      existingMembers.map(m => [`${m.id}-${m.licence}`, m])
    );

    const membersToCreate: Member[] = [];
    const membersToUpdate: Member[] = [];

    members.forEach(member => {
      const key = `${member.id}-${member.licence}`;
      if (existingMap.has(key)) {
        membersToUpdate.push(member);
      } else {
        membersToCreate.push(member);
      }
    });

    return { membersToCreate, membersToUpdate };
  }

  private async processPoints(points: NumericPoints[]) {
    const startTime = Date.now();
    
    for (let i = 0; i < points.length; i += POINTS_BATCH_SIZE) {
      const batch = points.slice(i, i + POINTS_BATCH_SIZE);
      const pointsToUpsert = await this.filterPointsForUpsert(batch);
      
      if (pointsToUpsert.length > 0) {
        await this.prismaService.$transaction(async (tx) => {
          await tx.$executeRaw`
            INSERT INTO "NumericPoints" (
              "memberId", "memberLicence", date, points, ranking,
              "rankingLetterEstimation", "rankingWI"
            )
            SELECT * FROM UNNEST(
              ${pointsToUpsert.map(p => p.memberId)}::integer[],
              ${pointsToUpsert.map(p => p.memberLicence)}::integer[],
              ${pointsToUpsert.map(p => p.date)}::timestamp[],
              ${pointsToUpsert.map(p => p.points)}::double precision[],
              ${pointsToUpsert.map(p => p.ranking)}::integer[],
              ${pointsToUpsert.map(p => p.rankingLetterEstimation)}::text[],
              ${pointsToUpsert.map(p => p.rankingWI)}::integer[]
            )
            ON CONFLICT ("memberId", "memberLicence", date) DO UPDATE SET
              points = EXCLUDED.points,
              ranking = EXCLUDED.ranking,
              "rankingLetterEstimation" = EXCLUDED."rankingLetterEstimation",
              "rankingWI" = EXCLUDED."rankingWI"
          `;
        }, { timeout: TRANSACTION_TIMEOUT, maxWait: TRANSACTION_TIMEOUT });
      }
    }

    this.logger.debug(`Processed ${points.length} points in ${Date.now() - startTime}ms`);
  }

  private async filterPointsForUpsert(points: NumericPoints[]) {
    const latestPoints = await this.prismaService.numericPoints.findMany({
      where: {
        OR: points.map(p => ({
          memberId: p.memberId,
          memberLicence: p.memberLicence,
        })),
      },
      orderBy: { date: 'desc' },
      distinct: ['memberId', 'memberLicence'],
    });

    const latestMap = new Map(
      latestPoints.map(p => [`${p.memberId}-${p.memberLicence}`, p])
    );

    return points.filter(point => {
      const latest = latestMap.get(`${point.memberId}-${point.memberLicence}`);
      return !latest || latest.points !== point.points || latest.ranking !== point.ranking;
    });
  }

  private parseLine(line: string, playerCategory: PlayerCategory): { member: Member, numericPoints: NumericPoints } {
    const cols = line.split(';');
    
    if (cols.length < 13) {
      throw new Error(`Invalid line format: ${line}`);
    }

    const member: Member = {
      id: parseInt(cols[0], 10),
      licence: parseInt(cols[1], 10),
      playerCategory,
      firstname: cols[3],
      lastname: cols[2],
      ranking: cols[4],
      club: cols[5],
      category: cols[7],
      worldRanking: cols[8].length ? parseInt(cols[8], 10) : 0,
      nationality: cols[9],
      email: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const numericPoints: NumericPoints = {
      memberId: parseInt(cols[0], 10),
      memberLicence: parseInt(cols[1], 10),
      date: new Date(),
      points: parseFloat(cols[10]),
      ranking: cols[11].length ? parseInt(cols[11]) : null,
      rankingWI: cols[12].length ? parseInt(cols[12]) : null,
      rankingLetterEstimation: null,
    };

    return { member, numericPoints };
  }

  private computeLineHash(line: string): string {
    return createHash('sha256').update(line).digest('hex');
  }

  private async filterChangedLines(lines: string[], playerCategory: PlayerCategory): Promise<{ changedLines: string[] }> {
    // Get the latest import for this category
    const lastImport = await this.prismaService.dataImport.findFirst({
      where: { 
        type: ImportType.MEMBER,
        playerCategory 
      },
      orderBy: { importedAt: 'desc' },
    });

    if (!lastImport) {
      this.logger.log('No previous import found, processing all lines');
      return { changedLines: lines };
    }

    // Create a set of previous hashes for O(1) lookup
    const previousHashes = new Set(lastImport.lineHashes);
    
    // Filter only lines that have changed or are new
    const changedLines = lines.filter(line => {
      const hash = this.computeLineHash(line);
      return !previousHashes.has(hash);
    });

    return { changedLines };
  }

  private async storeImport(lines: string[], playerCategory: PlayerCategory): Promise<void> {
    const lineHashes = lines.map(line => this.computeLineHash(line));
    
    await this.prismaService.dataImport.create({
      data: {
        type: ImportType.MEMBER,
        playerCategory,
        lineHashes,
      },
    });
  }
}

