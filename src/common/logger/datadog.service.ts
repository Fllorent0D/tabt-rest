import { Injectable, Scope } from '@nestjs/common';
import { StatsD } from 'hot-shots';
import { Tracer, tracer } from 'dd-trace';
import { PackageService } from '../package/package.service';

@Injectable({ scope: Scope.DEFAULT })
export class DatadogService {
  public statsD: StatsD;
  public tracer: Tracer;

  constructor(
    private readonly packageS: PackageService
  ) {
    this.statsD = new StatsD();
    this.tracer = tracer.init({
      env: process.env.NODE_ENV,
      service: packageS.name,
      version: packageS.version,
    });

  }
}
