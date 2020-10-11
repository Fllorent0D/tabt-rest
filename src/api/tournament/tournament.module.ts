import { Module } from '@nestjs/common';
import { TournamentService } from './providers/tournament.service';
import { TournamentController } from './controllers/tournament.controller';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [TournamentService],
  controllers: [TournamentController]
})
export class TournamentModule {}
