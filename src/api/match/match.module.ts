import { Module } from '@nestjs/common';
import { MatchController } from './controllers/match.controller';
import { MatchService } from '../../services/matches/match.service';
import { CommonModule } from '../../common/common.module';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports:[CommonModule, ServicesModule],
  controllers: [MatchController],
  providers: [MatchService]
})
export class MatchModule {}
