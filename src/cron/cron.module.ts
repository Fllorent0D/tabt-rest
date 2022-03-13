import { Module } from '@nestjs/common';
import { SyncMemberCron } from './sync-member.cron';
import { CommonModule } from '../common/common.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ServicesModule } from '../services/services.module';


@Module({
  imports: [
    CommonModule,
    ScheduleModule.forRoot(),
    ServicesModule
  ],
  providers: [
    SyncMemberCron,
  ],
})
export class CronModule {
}
