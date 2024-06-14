import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ResultsSyncCronService } from './results-sync-cron.service';
import { BullModule } from '@nestjs/bull';
import { ResultsProcessorService } from './results-processor.service';

export const RESULTS_SYNC_QUEUE = 'results';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'results',
    }),
  ],
  providers: [ResultsSyncCronService, ResultsProcessorService],
})
export class ResultsSyncModule {}
