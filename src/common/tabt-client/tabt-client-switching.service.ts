import { Inject, Injectable } from '@nestjs/common';
import { DatabaseContextService, TABT_LANGUAGE } from '../context/database-context.service';
import { TabTAPISoap } from '../../entity/tabt/TabTAPI_Port';

@Injectable()
export class TabtClientSwitchingService {

  constructor(
    private readonly langService: DatabaseContextService,
    @Inject('tabt-aftt') private readonly tabtAFTT: TabTAPISoap,
    @Inject('tabt-vttl') private readonly tabtVTTL: TabTAPISoap,
  ) {
  }

  get tabtClient(): TabTAPISoap {
    if (this.langService.language === TABT_LANGUAGE.AFTT) {
      return this.tabtAFTT;
    } else {
      return this.tabtVTTL;
    }
  }

}
