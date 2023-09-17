import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { genderMapping } from "../constants";
import { firstValueFrom } from "rxjs";
import { Injectable, Logger, Query } from "@nestjs/common";
import { DataAFTTIndividualResultModel } from "../model/individual-results.model";
import { CompetitionType, Gender, Result } from "@prisma/client";
import * as pqueue from 'p-queue';
import * as os from 'os';

@Injectable()
export class DataAFTTResultsProcessingService {

    private readonly logger = new Logger(DataAFTTResultsProcessingService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly individualResultModel: DataAFTTIndividualResultModel
    ) {
    }


    async process(): Promise<void> {
        const queue = new pqueue.default({concurrency: (os.cpus().length * 2) + 1});

        for (const [gender, mapping] of genderMapping) {
            const file = await this.downloadMemberFile(gender, mapping);

            // split lines and remove last line
            const lines = file.data.split('\n').slice(0, -1);
            this.logger.log(`File downloaded, start processing with concurrency ${queue.concurrency}...`);
            queue.addAll(lines.map(line => async () => {
                const cols = line.split(';');
                await this.updateDB(cols, gender);
            }));
           
                /*
                1;          ID 
                2023-09-03; DATA
                514275;     MEMBER_ID
                512448;     OPPONENT_ID
                D;          RESULT
                5 2-3;    SETS
        
                6 - SANDER;    OPPONENT_LASTNAME
                7 - TEMMERMAN;   OPPONENT_FIRSTNAME
        
                8 - B6;       OPPONENT_RANKING
                9 - T;        competition_type
                10 - C2;       Member_ranking
        
                11 - 5;        competition_context
                12 - B tornooi Merelbeke;  competition_name
                13 - 1449;     member_points
                14 - 1739;     opponent_points
                15 - -290;     points_difference
                16 - -2;       points to add
                17 - 0.5;      loosing factor
                18 - -1        definitive points to add
                */

            


            this.logger.log(`Processing done. (${lines.length} lines)`);

        }
    }

    private async downloadMemberFile(gender: Gender, mapping: string) {
        this.logger.log(`Downloading ${gender} results file from data.aftt.be`);

        const url = `https://data.aftt.be/export/liste_result_${mapping}.txt`;
        const file = await firstValueFrom(this.httpService.get<string>(url, {
            auth: {
                username: this.configService.get('AFTT_DATA_USERNAME'),
                password: this.configService.get('AFTT_DATA_PASSWORD')
            },
            responseType: 'text'
        }));
        return file;
    }

    private async updateDB(cols: string[], gender: Gender) {
        try {
            await this.individualResultModel.upsert({
                id: parseInt(cols[0], 10),
                date: new Date(cols[1]),
                memberLicence: parseInt(cols[2], 10),
                memberRanking: cols[10],
                memberPoints: parseInt(cols[13], 10),
                opponentRanking: cols[8],
                opponentLicence: parseInt(cols[3], 10),
                opponentPoints: parseInt(cols[14], 10),
                result: cols[4] === 'V' ? Result.VICTORY : Result.DEFEAT,
                score: cols[5],
                competitionType: cols[9] === 'T' ? CompetitionType.TOURNAMENT : CompetitionType.CHAMPIONSHIP,
                competitionCoef: parseFloat(cols[11]),
                competitionName: cols[12],
                diffPoints: parseInt(cols[15], 10),
                pointsToAdd: parseInt(cols[16], 10),
                looseFactor: parseFloat(cols[17]),
                definitivePointsToAdd: parseInt(cols[18], 10),
            }, gender);
        } catch (e) {
            this.logger.error(e.message);
        }
    }
}