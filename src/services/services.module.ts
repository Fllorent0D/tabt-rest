import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
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
import { TestRequestService } from './test/test-request.service';
import { InternalIdMapperService } from './id-mapper/internal-id-mapper.service';
import { Head2headService } from './members/head2head.service';
import { EloMemberService } from './members/elo-member.service';
import { MatchesMembersRankerService } from './matches/matches-members-ranker.service';
import { MembersSearchIndexService } from './members/members-search-index.service';
import { MemberCategoryService } from './members/member-category.service';
import { DataAfftTokenRefresherService } from './members/data-afft-token-refresher.service';

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
  MatchSystemService,
  TestRequestService,
  InternalIdMapperService,
  Head2headService,
  EloMemberService,
  MatchesMembersRankerService,
  MembersSearchIndexService,
  MemberCategoryService,
  DataAfftTokenRefresherService
];

@Module({
  imports: [CommonModule, HttpModule],
  providers: [...services],
  exports: [...services],
})
export class ServicesModule {
}
