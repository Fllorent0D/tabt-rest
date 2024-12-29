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
      limiter: {
        max: 1,
        duration: 100000,
      },
    }),
  ],
  providers: [ResultsSyncCronService, ResultsProcessorService],
})
export class ResultsSyncModule {}
