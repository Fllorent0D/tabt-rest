import { Inject, Injectable } from '@nestjs/common';
import { DatabaseContextService, TABT_DATABASE } from '../context/database-context.service';
import { TabTAPISoap } from '../../entity/tabt-soap/TabTAPI_Port';

@Injectable()
export class TabtClientSwitchingService {

  constructor(
    private readonly databaseContextService: DatabaseContextService,
    @Inject('tabt-aftt') private readonly tabtAFTT: TabTAPISoap,
    @Inject('tabt-vttl') private readonly tabtVTTL: TabTAPISoap,
  ) {
  }

  get tabtClient(): TabTAPISoap {
    switch(this.databaseContextService.database){
      case TABT_DATABASE.AFTT:
        return this.tabtAFTT;
      case TABT_DATABASE.VTTL:
        return this.tabtVTTL;
    }
  }

}
