import { CacheModule, Module } from '@nestjs/common';
import { DivisionsController } from './controllers/divisions.controller';
import { DivisionService } from './providers/division.service';
import { ProvidersModule } from '../../providers/providers.module';
import { DivisionRankingService } from './providers/division-ranking.service';

@Module({
  imports: [ProvidersModule],
  controllers: [DivisionsController],
  providers: [DivisionService, DivisionRankingService],
})
export class DivisionsModule {
}
