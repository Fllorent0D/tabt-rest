import { Injectable } from '@nestjs/common';
import { ContextService } from './context.service';
import { HeaderKeys } from './context.constants';

export enum TABT_LANGUAGE {
  AFTT = 'aftt',
  VTTL = 'vttl'
}

export const DEFAULT_LANG = TABT_LANGUAGE.AFTT;

@Injectable()
export class DatabaseContextService {
  constructor(
    private readonly contextService: ContextService,
  ) {
  }


  get database(): string {
    const lang: string = (<any>this.contextService.context.caller)?.[HeaderKeys.X_TABT_DATABASE];

    switch (lang) {
      case 'aftt':
        return TABT_LANGUAGE.AFTT;
      case 'vttl':
        return TABT_LANGUAGE.VTTL;
      default:
        return DEFAULT_LANG;
    }
  }

}
