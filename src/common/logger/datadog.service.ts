import { Injectable, Scope } from '@nestjs/common';
import { StatsD } from 'hot-shots';

@Injectable({ scope: Scope.DEFAULT })
export class DatadogService {
  public statsD: StatsD;

  constructor() {
    this.statsD = new StatsD();
  }
}
