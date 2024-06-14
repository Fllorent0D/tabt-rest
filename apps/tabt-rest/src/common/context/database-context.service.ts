import { Injectable } from '@nestjs/common';
import { ContextService } from './context.service';
import { HeaderKeys } from './context.constants';

export enum TABT_DATABASE {
  AFTT = 'aftt',
  VTTL = 'vttl',
}

export const DEFAULT_LANG = TABT_DATABASE.AFTT;

@Injectable()
export class DatabaseContextService {
  constructor(private readonly contextService: ContextService) {}

  get database(): TABT_DATABASE {
    const lang: string = (<any>this.contextService.context.caller)[
      HeaderKeys.X_TABT_DATABASE
    ];

    switch (lang) {
      case 'aftt':
        return TABT_DATABASE.AFTT;
      case 'vttl':
        return TABT_DATABASE.VTTL;
      default:
        return DEFAULT_LANG;
    }
  }
}
