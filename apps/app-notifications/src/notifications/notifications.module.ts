import { Module, OnModuleInit } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TeamMatchEventNotifierService } from './team-match-event-notifier.service';
import { CommonModule } from '../common/common.module';
import { NumericRankingNotifierService } from './numeric-ranking-notifier.service';

@Module({
  imports: [HttpModule, CommonModule],
  providers: [TeamMatchEventNotifierService, NumericRankingNotifierService],
})
export class NotificationsModule implements OnModuleInit {
  constructor(
    private readonly numericRankingNotifierService: NumericRankingNotifierService,
    private readonly teamMatchEventNotifierService: TeamMatchEventNotifierService,
  ) {}

  onModuleInit(): void {
    this.numericRankingNotifierService.start();
    this.teamMatchEventNotifierService.start();
  }
}
