import { Module } from '@nestjs/common';
import { MatchController } from './controllers/match.controller';
import { MatchService } from '../../services/matches/match.service';
import { CommonModule } from '../../common/common.module';
import { ServicesModule } from '../../services/services.module';
import { Head2headController } from '../member/controllers/head2head.controller';

@Module({
  imports: [CommonModule, ServicesModule],
  controllers: [MatchController, Head2headController],
  providers: [MatchService],
})
export class MatchModule {}
