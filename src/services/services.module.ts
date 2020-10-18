import { Module } from '@nestjs/common';
import { ClubService } from './clubs/club.service';
import { ClubMemberService } from './clubs/club-member.service';
import { ClubTeamService } from './clubs/club-team.service';
import { DivisionService } from './divisions/division.service';
import { DivisionRankingService } from './divisions/division-ranking.service';
import { MatchService } from './matches/match.service';
import { MemberService } from './members/member.service';
import { SeasonService } from './seasons/season.service';
import { TournamentService } from './tournaments/tournament.service';
import { CommonModule } from '../common/common.module';
import { MatchSystemService } from './matches/match-system.service';

const services = [
  ClubService,
  ClubMemberService,
  ClubTeamService,
  DivisionService,
  DivisionRankingService,
  MatchService,
  MemberService,
  SeasonService,
  TournamentService,
  MatchSystemService
];

@Module({
  imports: [CommonModule],
  providers: [...services],
  exports: [...services],
})
export class ServicesModule {
}
