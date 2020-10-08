import { Module } from '@nestjs/common';
import { ClubController } from './controllers/club.controller';
import { ClubService } from './providers/club.service';
import { ClubMemberService } from './providers/club-member.service';
import { ClubTeamService } from './providers/club-team.service';
import { ProvidersModule } from '../../providers/providers.module';

@Module({
  imports:[ProvidersModule],
  controllers: [ClubController],
  providers: [ClubService, ClubTeamService, ClubMemberService]
})
export class ClubModule {}
