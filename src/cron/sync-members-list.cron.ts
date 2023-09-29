import { Injectable, Logger } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { DataAFTTMemberProcessingService } from '../common/data-aftt/services/member-processing.service';
import { DataAFTTResultsProcessingService } from '../common/data-aftt/services/results-processing.service';

@Injectable()
export class SyncMembersListCron {
  private readonly logger = new Logger(SyncMembersListCron.name);

  constructor(
    private readonly memberProcessingService: DataAFTTMemberProcessingService,
    private readonly resultProcessingService: DataAFTTResultsProcessingService,
  ) {
  }

  // Run every day at 9:00 AM
  @Cron('0 0 9 * * *')
  async syncMembers() {
    this.logger.log('Daily members sync starting...');

    if (process.env.NODE_ENV === 'production') {
      await this.memberProcessingService.process();
      await this.resultProcessingService.process();
    }
  }

  @Timeout(1000)
  async syncMembersAtBootstrap() {
    this.logger.log('Members sync starting at bootstrap...');
    if (process.env.NODE_ENV === 'production') {
      await this.memberProcessingService.process();
      await this.resultProcessingService.process();
    }
  }


  /*
    https://data.aftt.be/export/liste_joueurs_1.txt
    https://data.aftt.be/export/liste_joueurs_2.txt
    https://data.aftt.be/export/liste_result_1.txt
    https://data.aftt.be/export/liste_result_2.txt
     */


}
