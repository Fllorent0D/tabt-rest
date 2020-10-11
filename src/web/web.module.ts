import { Module } from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/logger/logger.middleware';

@Module({
  providers: [
    LoggerMiddleware,
  ],
  exports: [
    LoggerMiddleware
  ]
})
export class WebModule {}
