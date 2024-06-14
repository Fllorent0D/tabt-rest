import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiModule, Configuration } from './common/tabt-client';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { TeamMatchEventController } from './controllers/team-match-event.controller';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { NumericRankingEventController } from './controllers/numeric-ranking-event.controller';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [
    TerminusModule,
    AuthModule,
    CommonModule,
    ScheduleModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'debug',
      },
    }),
    ConfigModule.forRoot(),
    ApiModule.forRoot(
      () => new Configuration({ basePath: 'https://api.beping.be' }),
    ),
    AuthModule,
    NotificationsModule,
  ],
  controllers: [
    HealthController,
    TeamMatchEventController,
    NumericRankingEventController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
