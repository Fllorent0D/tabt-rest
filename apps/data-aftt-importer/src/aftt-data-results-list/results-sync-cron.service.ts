import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PlayerCategory } from '@prisma/client';

@Injectable()
export class ResultsSyncCronService {
  private readonly logger = new Logger(ResultsSyncCronService.name);

  constructor(@InjectQueue('results') private readonly queue: Queue) {
    this.syncResults();
  }

  // Run every day at 9:30 AM
  @Cron('0 30 9 * * *')
  async syncResults() {
    this.logger.debug('Daily members sync starting...');
    await this.queue.add({ playerCategory: PlayerCategory.MEN });
    await this.queue.add({ playerCategory: PlayerCategory.WOMEN });
  }

  /*
    https://data.aftt.be/export/liste_joueurs_1.txt
    https://data.aftt.be/export/liste_joueurs_2.txt
    https://data.aftt.be/export/liste_result_1.txt
    https://data.aftt.be/export/liste_result_2.txt
     */
}
