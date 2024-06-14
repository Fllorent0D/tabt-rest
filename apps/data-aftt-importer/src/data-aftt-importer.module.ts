import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { MembersListSyncModule } from './aftt-data-members-list/members-list-sync.module';
import { ResultsSyncModule } from './aftt-data-results-list/results-sync.module';
import { CommonModule } from './common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          redis: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        };
      },
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'BEPING_NOTIFIER',
          useFactory: (configService: ConfigService) => {
            return {
              transport: Transport.REDIS,
              options: {
                host: configService.get('TABT_SERVICE_HOST'),
                port: configService.get('TABT_SERVICE_PORT'),
              },
            };
          },
          inject: [ConfigService],
          imports: [ConfigModule],
        },
      ],
    }),
    MembersListSyncModule,
    ResultsSyncModule,
    CommonModule,
  ],
})
export class DataAFTTImporterModule {}
