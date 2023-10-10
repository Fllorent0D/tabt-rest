import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DataAFTTMemberModel } from '../model/member.model';
import { DataAFTTMemberNumericRankingModel } from '../model/member-numeric-ranking.model';
import { genderMapping } from '../constants';
import { firstValueFrom } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';
import { Gender } from '@prisma/client';

@Injectable()
export class DataAFTTMemberProcessingService {

  private readonly logger = new Logger(DataAFTTMemberProcessingService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly memberServiceModel: DataAFTTMemberModel,
    private readonly numericRankingModel: DataAFTTMemberNumericRankingModel,
  ) {
  }


  async process(): Promise<void> {
    for (const [gender, mapping] of genderMapping) {
      const file = await this.downloadFile(gender, mapping);

      // split lines and remove last line
      const lines = file.data.split('\n').slice(0, -1);
      //console.log(cols);
      this.logger.log(`File downloaded, start processing ${lines.length} lines...`);
      for (const line of lines) {
        const cols = line.split(';');
        await this.updateDB(cols, gender);
      }
      this.logger.log(`Processing done. (${lines.length} lines)`);
    }
  }

  private async updateDB(cols: string[], gender: Gender) {
    try {
      await this.memberServiceModel.upsert({
        id: parseInt(cols[0], 10),
        licence: parseInt(cols[1], 10),
        gender,
        lastname: cols[2],
        firstname: cols[3],
        ranking: cols[4],
        club: cols[5],
        category: cols[7],
        worldRanking: parseInt(cols[8], 10),
        nationality: cols[9],
      });
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
      await this.numericRankingModel.insertInHistory({
        memberId: parseInt(cols[0], 10),
        memberLicence: parseInt(cols[1], 10),
        date: new Date(),
        points: parseFloat(cols[10]),
        ranking: cols[11].length ? parseInt(cols[11]) : null,
        rankingWI: cols[12].length ? parseInt(cols[12]) : null,
        rankingLetterEstimation: null,
      });
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  private async downloadFile(gender: string, mapping: string) {
    this.logger.log(`Downloading ${gender} file from data.aftt.be`);
    const url = `https://data.aftt.be/export/liste_joueurs_${mapping}.txt`;
    const file = await firstValueFrom(this.httpService.get<string>(url, {
      auth: {
        username: this.configService.get('AFTT_DATA_USERNAME'),
        password: this.configService.get('AFTT_DATA_PASSWORD'),
      },
      responseType: 'text',
    }));
    return file;
  }
}
