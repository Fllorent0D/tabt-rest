import { Module } from '@nestjs/common';
import { MatchController } from './controllers/match.controller';
import { MatchService } from './providers/match.service';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [MatchController],
  providers: [MatchService]
})
export class MatchModule {}
