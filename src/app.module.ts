import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServicesModule } from './services/services.module';
import { CommonModule } from './common/common.module';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { GuidUtil } from './common/utils/guid.util';
import { HeaderKeys } from './common/context/context.constants';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServicesModule,
    CommonModule,
    ApiModule,
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      serveRoot: '/static',
      exclude: ['/api*']
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'debug',
        serializers: {
          req: (req) => {
            req.headers[HeaderKeys.X_TABT_PASSWORD] = undefined;
            return req;
          },
        },
        genReqId: () => GuidUtil.generateUuid(),
        prettyPrint: process.env.NODE_ENV === 'production' ? false : {
          colorize: true,
          translateTime: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {
}
