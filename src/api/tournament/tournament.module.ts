import { Module } from '@nestjs/common';
import { TournamentService } from '../../services/tournaments/tournament.service';
import { TournamentController } from './controllers/tournament.controller';
import { CommonModule } from '../../common/common.module';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports:[CommonModule, ServicesModule],
  providers: [TournamentService],
  controllers: [TournamentController]
})
export class TournamentModule {}
