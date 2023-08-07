import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { ServicesModule } from '../../services/services.module';
import { MemberDashboardController } from './controllers/member-dashboard.controller';
import { MemberDashboardService } from './services/member-dashboard.service';
import { DivisionDashboardService } from './services/division-dashboard.service';
import { DivisionDashboardController } from './controllers/division-dashboard.controller';
import { ClubDashboardService } from './services/club-dashboard.service';
import { ClubDashboardController } from './controllers/club-dashboard.controller';

@Module({
  imports: [CommonModule, ServicesModule],
  controllers: [MemberDashboardController, DivisionDashboardController, ClubDashboardController],
  providers: [MemberDashboardService, DivisionDashboardService, ClubDashboardService],
})
export class DashboardModule {
}
