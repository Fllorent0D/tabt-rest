import { Module } from '@nestjs/common';
import { DivisionsModule } from './divisions/divisions.module';
import { ClubModule } from './club/club.module';
import { TournamentModule } from './tournament/tournament.module';
import { SeasonModule } from './season/season.module';
import { MemberModule } from './member/member.module';
import { MatchModule } from './match/match.module';

@Module({
  imports: [
    DivisionsModule,
    ClubModule,
    TournamentModule,
    SeasonModule,
    MemberModule,
    MatchModule
  ],
})
export class ApiModule {
}
