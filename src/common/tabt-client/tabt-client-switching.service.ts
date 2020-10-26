import { Inject, Injectable, Logger } from '@nestjs/common';
import { DatabaseContextService, TABT_LANGUAGE } from '../context/database-context.service';
import { TabTAPISoap } from '../../entity/tabt-soap/TabTAPI_Port';

@Injectable()
export class TabtClientSwitchingService {
  private readonly logger = new Logger('TabtClientSwitchingService', true);

  constructor(
    private readonly databaseContextService: DatabaseContextService,
    @Inject('tabt-aftt') private readonly tabtAFTT: TabTAPISoap,
    @Inject('tabt-vttl') private readonly tabtVTTL: TabTAPISoap,
  ) {
  }

  get tabtClient(): TabTAPISoap {
    if (this.databaseContextService.database === TABT_LANGUAGE.AFTT) {
      return this.tabtAFTT;
    } else {
      return this.tabtVTTL;
    }
  }

}
