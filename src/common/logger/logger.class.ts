import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { Logtail } from '@logtail/node';
import { ConfigService } from '@nestjs/config';
import { LogLevel } from '@logtail/types';

@Injectable({ scope: Scope.TRANSIENT })
export class LogtailLogger implements LoggerService {
  private readonly logger: Logtail

  constructor(
    private readonly configurationService: ConfigService,
  ) {
    this.logger = new Logtail(this.configurationService.get('LOGTAIL_TOKEN'));
  }

  debug(message: any, context?: string): any {
    console.log(message, context)
    this.logger.debug(message, { context })
  }

  error(message: any, trace?: string, context?: string): any {
    console.log(message, context)
    this.logger.error(message, { context, trace })
  }

  log(message: any, context?: string): any {
    console.log(message, context)
    this.logger.log(message, LogLevel.Info, { context })
  }

  verbose(message: any, context?: string): any {
    console.log(message, context)
    this.logger.debug(message, { context })

  }

  warn(message: any, context?: string): any {
    console.log(message, context)
    this.logger.warn(message, { context })
  }


}
