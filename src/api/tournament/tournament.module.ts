import { Module } from '@nestjs/common';
import { TournamentService } from './providers/tournament.service';
import { TournamentController } from './controllers/tournament.controller';
import { ProvidersModule } from '../../providers/providers.module';

@Module({
  imports: [ProvidersModule],
  providers: [TournamentService],
  controllers: [TournamentController]
})
export class TournamentModule {}
