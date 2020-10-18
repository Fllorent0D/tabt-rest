import { Module } from '@nestjs/common';
import { ClubController } from './controllers/club.controller';
import { ClubService } from '../../services/clubs/club.service';
import { ClubMemberService } from '../../services/clubs/club-member.service';
import { ClubTeamService } from '../../services/clubs/club-team.service';
import { CommonModule } from '../../common/common.module';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports:[CommonModule, ServicesModule],
  controllers: [ClubController],
  providers: [ClubService, ClubTeamService, ClubMemberService]
})
export class ClubModule {}
