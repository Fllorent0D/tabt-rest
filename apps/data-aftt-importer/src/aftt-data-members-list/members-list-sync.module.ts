import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MembersListSyncCron } from './members-list-sync-cron.service';
import { MembersListProcessingService } from './members-list-sync-processor';
import { BullModule } from '@nestjs/bull';

export const MEMBERS_LIST_SYNC_QUEUE = 'members';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'members',
    }),
  ],
  providers: [MembersListSyncCron, MembersListProcessingService],
})
export class MembersListSyncModule {}
