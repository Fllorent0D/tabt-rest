import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ServicesModule } from '../services/services.module';
import { SyncMembersListCron } from './sync-members-list.cron';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [
    CommonModule,
    ScheduleModule.forRoot(),
    ServicesModule,
    HttpModule
  ],
  providers: [
    SyncMembersListCron,
  ],
})
export class CronModule {
}
