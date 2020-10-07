import { CacheModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProvidersModule } from './providers/providers.module';
import { DivisionsModule } from './divisions/divisions.module';
import { ConfigModule } from './config/config.module';
import { CommonModule } from './common/common.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ClubModule } from './club/club.module';
import { TournamentModule } from './tournament/tournament.module';
import { SeasonModule } from './season/season.module';
import { MemberModule } from './member/member.module';
import { MatchModule } from './match/match.module';

@Module({
  imports: [
    ProvidersModule,
    DivisionsModule,
    ConfigModule,
    CommonModule,
    ClubModule,
    TournamentModule,
    SeasonModule,
    MemberModule,
    MatchModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {

    consumer
      .apply(LoggerMiddleware)
      .forRoutes('/');
  }
}
