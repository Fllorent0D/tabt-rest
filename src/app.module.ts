import { Module } from '@nestjs/common';
import { ServicesModule } from './services/services.module';
import { CommonModule } from './common/common.module';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { GuidUtil } from './common/utils/guid.util';
import { HeaderKeys } from './common/context/context.constants';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LogtailLogger } from './common/logger/logtail.class';

@Module({
  imports: [
    ServicesModule,
    CommonModule,
    ApiModule,
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', process.env.STATIC_PREFIX),
      serveRoot: '/' + process.env.STATIC_PREFIX,
      exclude: [`/${process.env.API_PREFIX}*`],
    }),
    LoggerModule.forRoot({
      pinoHttp: [{
        level: 'debug',
        serializers: {
          req: (req) => {
            req.headers[HeaderKeys.X_TABT_PASSWORD] = undefined;
            return req;
          },
        },
        formatters: {
          level: (label) => {
            return { level: label };
          },
        },
        genReqId: () => GuidUtil.generateUuid(),
        prettyPrint: process.env.NODE_ENV === 'production' ? false : {
          colorize: true,
          translateTime: true,
        },
      }, {
        write: (msg: string) => {
          LogtailLogger.writeToLogtail(msg);
        },
      }],
    }),
  ],
})
export class AppModule {
}
