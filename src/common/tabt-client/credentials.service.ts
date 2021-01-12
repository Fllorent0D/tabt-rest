import { ContextService } from '../context/context.service';
import { Credentials } from '../../entity/tabt-soap/TabTAPI_Port';
import { HeaderKeys } from '../context/context.constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CredentialsService {
  constructor(private readonly contextService: ContextService) {
  }

  enrichInputWithCredentials<T>(input: T): T {
    const credentials: Credentials = {
      Account: (<any>this.contextService.context.caller)[HeaderKeys.X_TABT_ACCOUNT],
      Password: (<any>this.contextService.context.caller)[HeaderKeys.X_TABT_PASSWORD],
      OnBehalfOf: (<any>this.contextService.context.caller)[HeaderKeys.X_TABT_ONBEHALFOF],
    };

    if (credentials.Account && credentials.Password) {
      return {
        ...input,
        Credentials: credentials,
      };
    }

    return input;
  }

  get extraHeaders(): { [header: string]: string } {
    return {
      [HeaderKeys.X_FORWARDED_FOR]: this.contextService.context.caller[HeaderKeys.X_FORWARDED_FOR] || this.contextService.context.caller.remoteAddress,
    };
  }

}
