import { Inject, Injectable, Scope } from '@nestjs/common';
import { Context, RunnerContext } from './context.contract';
import { HttpUtil } from '../utils/http.util';
import { REQUEST } from '@nestjs/core';
import { PackageService } from '../package/package.service';
import { ConfigService } from '@nestjs/config';

@Injectable({scope: Scope.REQUEST})
export class ContextService {

  private readonly runnerContext: RunnerContext;
  readonly context: Context;

  private httpHeaderKeys: Set<string>;

  constructor(
    @Inject(REQUEST) request,
    @Inject('TABT_HEADERS') tabtHeaders: string[],
    private readonly packageService: PackageService,
    private readonly configService: ConfigService
  ) {
    this.runnerContext = {
      name: this.packageService.name,
      version: this.packageService.version,
      pid: process.pid,
      season: Number(configService.get('CURRENT_SEASON'))
    };
    this.httpHeaderKeys = new Set<string>();
    this.registerHttpHeaders(tabtHeaders)

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
        remoteAddress: request['connection']['remoteAddress'] === '::1' ? '127.0.0.1' : request['connection']['remoteAddress'].replace('::ffff:', ''),
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
