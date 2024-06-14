import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../common/event-bus/event-bus.service';
import { MessagingFirebaseService } from '../common/firebase/messaging-firebase.service';
import { TabtEventType } from '../common/event-bus/models/event.model';
import { delay, firstValueFrom, map } from 'rxjs';
import { TeamMatchEventDTO } from '../controllers/dto/team-match-event-d-t.o';
import {
  NOTIFICATIONS_EN,
  NOTIFICATIONS_FR,
  NOTIFICATIONS_NL,
} from './constants';
import { MatchesService, TeamMatchesEntry } from '../common/tabt-client';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class TeamMatchEventNotifierService {
  private readonly logger = new Logger(TeamMatchEventNotifierService.name);

  constructor(
    private readonly tabtEventBusService: EventBusService,
    private readonly messagingFirebaseService: MessagingFirebaseService,
    private readonly matchesService: MatchesService,
    private readonly prismaService: PrismaService,
  ) {}

  start(): void {
    this.listenEvents();
  }

  listenEvents(): void {
    this.tabtEventBusService
      .ofTypes<TeamMatchEventDTO>(TabtEventType.MATCH_RESULT_RECEIVED)
      .pipe(
        map((event) => event.payload),
        delay(1000 * 60 * 2),
      )
      .subscribe(async (eventDTO: TeamMatchEventDTO) => {
        this.logger.log(
          eventDTO,
          'Team match event received for ' + eventDTO.MatchId,
        );
        try {
          const findNotifications =
            await this.prismaService.mobileNotificationSent.findFirst({
              where: {
                id: eventDTO.MatchId,
                notificationType: 'MATCH',
                sent: true,
              },
            });
          if (findNotifications) {
            this.logger.warn(
              `Match ${eventDTO.MatchId} already notified. Skipping...`,
            );
            return;
          }

          const { data: matches } = await firstValueFrom(
            this.matchesService.findAllMatches(
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              eventDTO.WeekName,
              null,
              null,
              null,
              null,
              true,
              eventDTO.MatchId,
            ),
          );

          if (matches.length === 0) {
            this.logger.error(
              `Match ${eventDTO.MatchId} not found. Skipping...`,
            );
            return;
          }

          const match = matches[0];

          if (
            match.IsAwayForfeited ||
            match.IsHomeForfeited ||
            match.IsHomeWithdrawn ||
            match.IsAwayForfeited
          ) {
            this.logger.warn(
              `Match ${match.MatchUniqueId} is ff/fg. Adding to cache but will not sending notifications`,
            );
            await this.prismaService.mobileNotificationSent.create({
              data: {
                id: match.MatchUniqueId.toString(10),
                sent: false,
                notificationType: 'MATCH',
                messageIds: [],
              },
            });
            return;
          }

          this.logger.log(
            `Match ${match.MatchUniqueId} is not ff/fg. Sending notifications...`,
          );
          const messageIds = await this.notifyMatch(match);
          await this.prismaService.mobileNotificationSent.create({
            data: {
              id: match.MatchUniqueId.toString(10),
              sent: true,
              notificationType: 'MATCH',
              messageIds: messageIds,
            },
          });
        } catch (err) {
          this.logger.error('Error while sending notifications', err);
        }
      });
  }

  async notifyMatch(match: TeamMatchesEntry): Promise<string[]> {
    const text = this.getRandomNotificationText(match);
    this.logger.log(
      `Sending notifications for match ${match.MatchUniqueId} with text: ${text.fr}`,
    );
    return await this.messagingFirebaseService.sendPushNotifications([
      {
        notification: {
          title: 'Résultat du match',
          body: text.fr,
        },
        condition: `${this.topicConditionForMatch(
          match,
        )} && 'lang-fr' in topics`,
      },
      {
        notification: {
          title: 'Match result',
          body: text.en,
        },
        condition: `${this.topicConditionForMatch(
          match,
        )} && 'lang-en' in topics`,
      },
      {
        notification: {
          title: 'Wedstrijdresultaat',
          body: text.nl,
        },
        condition: `${this.topicConditionForMatch(
          match,
        )} && 'lang-nl' in topics`,
      },
    ]);
  }

  private getRandomNotificationText(match: TeamMatchesEntry) {
    // random number between 0 and NOTIFICATIONS_FR.team_match_result.length
    const randomIndex = Math.floor(
      Math.random() * NOTIFICATIONS_FR.team_match_result.length,
    );
    const splittedScore = match.Score.split('-').map(Number);
    if (splittedScore.length !== 2) {
      throw new Error('Score is not valid');
    }
    const [homeScore, awayScore] = splittedScore;
    const isDraw = homeScore === awayScore;
    const resultKey = isDraw ? 'draw_match' : 'team_match_result';
    const resultString = isDraw ? '' : homeScore > awayScore ? 'win' : 'lost';

    const replaceTokens = (template: string) => {
      return template
        .replace('[hometeam]', match.HomeTeam)
        .replace('[awayteam]', match.AwayTeam)
        .replace('[result]', resultString)
        .replace('[homescore]', homeScore.toString())
        .replace('[awayscore]', awayScore.toString());
    };

    return {
      fr: replaceTokens(NOTIFICATIONS_FR[resultKey][randomIndex]),
      en: replaceTokens(NOTIFICATIONS_EN[resultKey][randomIndex]),
      nl: replaceTokens(NOTIFICATIONS_NL[resultKey][randomIndex]),
    };
  }

  topicConditionForMatch(match: TeamMatchesEntry): string {
    return `('club-${match.HomeClub}' in topics || 'club-${
      match.AwayClub
    }' in topics || 'match-${
      match.MatchUniqueId
    }' in topics || 'division-${match.DivisionId.toString(10)}' in topics)`;
  }
}
