import { Module } from '@nestjs/common';
import { DivisionsController } from './controllers/divisions.controller';
import { DivisionService } from './providers/division.service';
import { DivisionRankingService } from './providers/division-ranking.service';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [DivisionsController],
  providers: [DivisionService, DivisionRankingService],
})
export class DivisionsModule {
}
