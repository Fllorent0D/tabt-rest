import { Injectable, Logger, Scope } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MembersSearchIndexService } from '../services/members/members-search-index.service';

@Injectable({ scope: Scope.DEFAULT })
export class SyncMemberCron {
  private readonly logger = new Logger(SyncMemberCron.name);

  constructor(
    private readonly membersSearchIndex: MembersSearchIndexService,
  ) {
  }

 async syncMembersToElastic() {
    this.logger.debug('Members sync for lookup starting...');
    try {
      await this.membersSearchIndex.indexMembers();

      this.logger.debug('Members sync for lookup ended successfully...');
    } catch (e) {
      this.logger.error(e, e.stack, 'Members sync for lookup ended with an error...');
    }

  }
}
