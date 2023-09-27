import { Injectable, Logger } from '@nestjs/common';
import { NotificationAcknolwedgement } from './models/notification-ack.model';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class BepingNotifierService {
  private readonly logger = new Logger(BepingNotifierService.name);
  constructor(
    private readonly httpClient: HttpService,
    private readonly configService: ConfigService
  ) {
  }


  async notifyNumericRankingChanged(uniqueIndex: number, oldRanking: number, newRanking: number): Promise<NotificationAcknolwedgement> {
    this.logger.log(`Notifying numeric ranking update for ${uniqueIndex} from ${oldRanking} to ${newRanking}`);
    if(oldRanking === newRanking || !oldRanking || !newRanking) {
      return null;
    }

    const ack = await this.sendNotification('numeric-ranking/update', {
      uniqueIndex,
      oldRanking,
      newRanking
    });
    this.logger.log(`Ack received for numeric ranking update for ${uniqueIndex} from ${oldRanking} to ${newRanking}: ${ack.acknolwedgedId}`);
    return ack;
  }

  private async sendNotification(url: string, payload: any): Promise<NotificationAcknolwedgement> {
    const notificationURL = this.configService.get<string>('BEPING_NOTIFICATION_URL');
    return firstValueFrom(
      this.httpClient.post<NotificationAcknolwedgement>(notificationURL + url, payload, {
        auth:{
          username: this.configService.get<string>('BEPING_NOTIFICATION_CONSUMER_KEY'),
          password: this.configService.get<string>('BEPING_NOTIFICATION_CONSUMER_SECRET')
        }
      }).pipe(
        map((response) => response.data)
      )
    );
  }

}
