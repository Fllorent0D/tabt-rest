import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { MessagingFirebaseService } from './messaging-firebase.service';

@Module({
  imports: [ConfigModule],
  providers: [MessagingFirebaseService],
  exports: [MessagingFirebaseService],
})
export class FirebaseModule {
  constructor(private readonly configService: ConfigService) {
    const adminConfig: ServiceAccount = {
      projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
      privateKey: this.configService
        .get<string>('FIREBASE_PRIVATE_KEY')
        .replace(/\\n/g, '\n'),
      clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
    };
    // Initialize the firebase admin app
    admin.initializeApp({
      credential: admin.credential.cert(adminConfig),
    });
  }
}
