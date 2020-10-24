import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServicesModule } from './services/services.module';
import { CommonModule } from './common/common.module';
import { LoggerMiddleware } from './web/middlewares/logger/logger.middleware';
import { WebModule } from './web/web.module';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { GuidUtil } from './common/utils/guid.util';
import { HeaderKeys } from './common/context/context.constants';

@Module({
  imports: [
    ServicesModule,
    CommonModule,
    ApiModule,
    WebModule,
    ConfigModule.forRoot(),
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('/');
  }
}
