import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PlayerCategory } from '@prisma/client';

@Injectable()
export class MembersListSyncCron {
  private readonly logger = new Logger(MembersListSyncCron.name);

  constructor(@InjectQueue('members') private readonly queue: Queue) {}

  // Run every day at 9:00 AM
  @Cron('0 0 9 * * *')
  async syncMembers() {
    this.logger.log('Daily members sync starting...');
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
