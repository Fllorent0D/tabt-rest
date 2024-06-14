import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';
import { CompetitionType, Gender, Result } from '@prisma/client';
import { DataAFTTIndividualResultModel } from './individual-results.model';

@Injectable()
export class DataAFTTResultsProcessingService {
  private readonly logger = new Logger(DataAFTTResultsProcessingService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly individualResultModel: DataAFTTIndividualResultModel,
  ) {}

  async process(): Promise<void> {
    for (const [gender, mapping] of genderMapping) {
      const file = await this.downloadMemberFile(gender, mapping);

      // split lines and remove last line
      const lines = file.data.split('\n').slice(0, -1);
      this.logger.log(
        `File downloaded, start processing ${lines.length} lines...`,
      );

      // Split lines into chunks for batch processing
      const chunkSize = 100; // Adjust this value based on your system's capability
      for (let i = 0; i < lines.length; i += chunkSize) {
        this.logger.log(
          `Processing chunk ${i / chunkSize + 1}/${Math.ceil(lines.length / chunkSize)}...`,
        );

        const chunk = lines.slice(i, i + chunkSize);

        // Process each chunk in parallel
        await Promise.all(
          chunk.map((line) => {
            const cols = line.split(';');
            return this.updateDB(cols, gender);
          }),
        );
      }

      this.logger.log(`Processing done. (${lines.length} lines)`);
    }
  }

  private async downloadMemberFile(gender: Gender, mapping: string) {
    this.logger.log(`Downloading ${gender} results file from data.aftt.be`);

    const url = `https://data.aftt.be/export/liste_result_${mapping}.txt`;
    const file = await firstValueFrom(
      this.httpService.get<string>(url, {
        auth: {
          username: this.configService.get('AFTT_DATA_USERNAME'),
          password: this.configService.get('AFTT_DATA_PASSWORD'),
        },
        responseType: 'text',
      }),
    );
    return file;
  }

  private async updateDB(cols: string[], gender: Gender) {
    try {
      await this.individualResultModel.upsert(
        {
          id: parseInt(cols[0], 10),
          date: new Date(cols[1]),
          memberLicence: parseInt(cols[2], 10),
          memberRanking: cols[10],
          memberPoints: parseFloat(cols[13]),
          opponentRanking: cols[8],
          opponentLicence: parseInt(cols[3], 10),
          opponentPoints: parseFloat(cols[14]),
          result: cols[4] === 'V' ? Result.VICTORY : Result.DEFEAT,
          score: cols[5],
          competitionType:
            cols[9] === 'T'
              ? CompetitionType.TOURNAMENT
              : CompetitionType.CHAMPIONSHIP,
          competitionCoef: parseFloat(cols[11]),
          competitionName: cols[12],
          diffPoints: cols[15].length ? parseFloat(cols[15]) : 0,
          pointsToAdd: cols[16].length ? parseFloat(cols[16]) : 0,
          looseFactor: cols[17].length ? parseFloat(cols[17]) : 0,
          definitivePointsToAdd: cols[18].length ? parseFloat(cols[18]) : 0,
        },
        gender,
      );
    } catch (e) {
      this.logger.error(e.message);
    }
  }
}
