import { Module } from '@nestjs/common';
import { ServicesModule } from './services/services.module';
import { CommonModule } from './common/common.module';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CronModule } from './cron/cron.module';

@Module({
  imports: [
    ServicesModule,
    CommonModule,
    ApiModule,
    ConfigModule.forRoot(),
    CronModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', process.env.STATIC_PREFIX),
      serveRoot: '/' + process.env.STATIC_PREFIX,
      exclude: [`/${process.env.API_PREFIX}*`],
    }),
  ],
})
export class AppModule {
}
