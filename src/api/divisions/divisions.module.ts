import { Module } from '@nestjs/common';
import { DivisionsController } from './controllers/divisions.controller';
import { DivisionService } from '../../services/divisions/division.service';
import { DivisionRankingService } from '../../services/divisions/division-ranking.service';
import { CommonModule } from '../../common/common.module';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports:[CommonModule, ServicesModule],
  controllers: [DivisionsController],
  providers: [DivisionService, DivisionRankingService],
})
export class DivisionsModule {
}
