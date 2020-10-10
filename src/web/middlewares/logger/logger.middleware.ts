import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('LoggerMiddleware')

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`${req.method} ${req.url}`)
    next();
  }
}
