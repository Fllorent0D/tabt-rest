import { Module } from '@nestjs/common';
import { ClubController } from './controllers/club.controller';
import { ClubService } from './providers/club.service';
import { ClubMemberService } from './providers/club-member.service';
import { ClubTeamService } from './providers/club-team.service';
import { CommonModule } from '../../common/common.module';

@Module({
  imports:[CommonModule],
  controllers: [ClubController],
  providers: [ClubService, ClubTeamService, ClubMemberService]
})
export class ClubModule {}
