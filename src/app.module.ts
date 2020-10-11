import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServicesModule } from './services/services.module';
import { ConfigModule } from './config/config.module';
import { CommonModule } from './common/common.module';
import { LoggerMiddleware } from './web/middlewares/logger/logger.middleware';
import { WebModule } from './web/web.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    ServicesModule,
    ConfigModule,
    CommonModule,
    ApiModule,
    WebModule
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
