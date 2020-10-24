import { Inject, Injectable, Scope } from '@nestjs/common';
import { Context, RunnerContext } from './context.contract';
import { TABT_HEADERS } from './context.constants';
import { HttpUtil } from '../utils/http.util';
import { GuidUtil } from '../utils/guid.util';
import { REQUEST } from '@nestjs/core';
import { PackageService } from '../package/package.service';
import { PinoLogger } from 'nestjs-pino';

@Injectable({scope: Scope.REQUEST})
export class ContextService {

  private readonly runnerContext: RunnerContext;
  readonly context: Context;

  private httpHeaderKeys: Set<string>;

  constructor(
    @Inject(REQUEST) request,
    private readonly packageService: PackageService,
    private readonly loggerService: PinoLogger
  ) {
    this.runnerContext = {
      name: this.packageService.name,
      version: this.packageService.version,
      pid: process.pid,
    };
    this.httpHeaderKeys = new Set<string>();
    this.registerHttpHeaders(TABT_HEADERS)

    this.context = this.createContext(request);
  }


  registerHttpHeaders(httpHeadersList: string[]) {
    httpHeadersList.forEach((httpHeaderOrList: string) => this.httpHeaderKeys.add(httpHeaderOrList));
  }

  private createContext(request: Express.Request): Context {
    return {
      runner: this.runnerContext,
      caller: {
        correlationId: request['id'],
        ...Array.from(this.httpHeaderKeys).reduce((acc: any, x: any) => {
          const httpHeaderValue = HttpUtil.getHeaderValue(request, x);
          if (httpHeaderValue) {
            acc[x] = httpHeaderValue;
          }
          return acc;
        }, {}),
      },
    };
  }

}
