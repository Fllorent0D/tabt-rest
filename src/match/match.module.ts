import { Module } from '@nestjs/common';
import { MatchController } from './controllers/match.controller';
import { MatchService } from './providers/match.service';
import { ProvidersModule } from '../providers/providers.module';

@Module({
  imports: [ProvidersModule],
  controllers: [MatchController],
  providers: [MatchService]
})
export class MatchModule {}
