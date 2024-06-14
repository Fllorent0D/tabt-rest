import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../common/event-bus/event-bus.service';
import { MessagingFirebaseService } from '../common/firebase/messaging-firebase.service';
import { CacheService } from '../common/cache/cache.service';
import { TabtEventType } from '../common/event-bus/models/event.model';
import { concatMap, delay, map, of } from 'rxjs';
import { NumericRankingEventDto } from '../controllers/dto/numeric-ranking-event.dto';
import {
  NOTIFICATIONS_EN,
  NOTIFICATIONS_FR,
  NOTIFICATIONS_NL,
} from './constants';
import { PrismaService } from '../common/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NumericRankingNotifierService {
  private readonly logger = new Logger(NumericRankingNotifierService.name);

  constructor(
    private readonly tabtEventBusService: EventBusService,
    private readonly messagingFirebaseService: MessagingFirebaseService,
    private readonly cacheService: CacheService,
    private readonly prismaService: PrismaService,
  ) {}

  start(): void {
    this.listenEvents();
  }

  private listenEvents(): void {
    this.tabtEventBusService
      .ofTypes(TabtEventType.NUMERIC_RANKING_RECEIVED)
      .pipe(
        map((event) => event.payload as NumericRankingEventDto),
        concatMap((value) => of(value).pipe(delay(100))),
      )
      .subscribe(async (numericRankingEvent) => {
        try {
          const messageIds = await this.notifyPlayer(numericRankingEvent);
          this.logger.debug(
            `Push notification sent to ${numericRankingEvent.uniqueIndex} with message ids: ${messageIds}`,
          );
          await this.prismaService.mobileNotificationSent.create({
            data: {
              // id + YYYYMMDD
              id:
                numericRankingEvent.uniqueIndex.toString(10) +
                new Date().toISOString().slice(0, 10).replace(/-/g, ''),
              messageIds: messageIds,
              sent: true,
              notificationType: NotificationType.RANKING,
            },
          });
        } catch (error) {
          this.logger.error(
            `Failed to send push notification for ${numericRankingEvent.uniqueIndex}`,
            error.stack,
          );
        }
      });
  }

  async notifyPlayer(event: NumericRankingEventDto): Promise<string[]> {
    // Pick a random notification text
    const notificationText = this.getRandomNotificationText(event);

    return await this.messagingFirebaseService.sendPushNotifications([
      {
        notification: {
          title: 'Classement numérique mis à jour',
          body: notificationText.fr,
        },
        condition: `('ranking_updated_${event.uniqueIndex}' in topics) && ('lang-fr' in topics)`,
      },
      {
        notification: {
          title: 'Numeric ranking updated',
          body: notificationText.en,
        },
        condition: `('ranking_updated_${event.uniqueIndex}' in topics) && ('lang-en' in topics)`,
      },
      {
        notification: {
          title: 'Numerieke ranking bijgewerkt',
          body: notificationText.nl,
        },
        condition: `('ranking_updated_${event.uniqueIndex}' in topics) && ('lang-nl' in topics)`,
      },
    ]);
  }

  private getRandomNotificationText(event: NumericRankingEventDto) {
    const date = new Date();
    const isFirstOrSecondDayOfMonth =
      date.getDate() === 1 || date.getDate() === 2;
    const randomIndex = isFirstOrSecondDayOfMonth
      ? Math.floor(Math.random() * 10)
      : 0;
    const rankingDifference = Math.abs(event.newRanking - event.oldRanking);
    const hasImproved = event.newRanking > event.oldRanking;
    const notificationType = hasImproved ? 'winning_points' : 'losing_points';
    const notificationTextKey = isFirstOrSecondDayOfMonth
      ? notificationType
      : 'regularisation_points';

    return {
      fr: NOTIFICATIONS_FR[notificationTextKey][randomIndex].replace(
        '[X]',
        rankingDifference.toString(),
      ),
      en: NOTIFICATIONS_EN[notificationTextKey][randomIndex].replace(
        '[X]',
        rankingDifference.toString(),
      ),
      nl: NOTIFICATIONS_NL[notificationTextKey][randomIndex].replace(
        '[X]',
        rankingDifference.toString(),
      ),
    };
  }
}
