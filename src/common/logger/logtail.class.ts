import { Logtail } from '@logtail/node';

export class LogtailLogger {

  private static logger: Logtail;

  static initialize(): void {
    if (process.env.LOGTAIL_TOKEN) {
      LogtailLogger.logger = new Logtail(process.env.LOGTAIL_TOKEN);
    }
  }

  static writeToLogtail(stringified: string): void {
    console.log('LOL:::', stringified);
    /*
    try {
      const { level, msg, ...context } = JSON.parse(stringified);
      LogtailLogger.logger.log(msg, level, context);

    } catch (e) {
      LogtailLogger.logger.error(e.message);
      console.error(e);
    }
    */
  }
}
