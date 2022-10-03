import { ContextService } from '../context/context.service';
import { Credentials } from '../../entity/tabt-soap/TabTAPI_Port';
import { HeaderKeys } from '../context/context.constants';
import { Injectable } from '@nestjs/common';
import { CallerContext } from '../context/context.contract';

@Injectable()
export class CredentialsService {
  constructor(private readonly contextService: ContextService) {
  }

  enrichInputWithCredentials<T>(input: T): T {
    const callerContext: CallerContext = this.contextService.context.caller;

    const credentials: Credentials = {
      Account: callerContext[HeaderKeys.X_TABT_ACCOUNT],
      Password: callerContext[HeaderKeys.X_TABT_PASSWORD],
      // nBehalfOf: Number(callerContext[HeaderKeys.X_TABT_ONBEHALFOF]),
    };
    if (!input['Season']) {
      input['Season'] = callerContext[HeaderKeys.X_TABT_SEASON] ? Number(callerContext[HeaderKeys.X_TABT_SEASON]) : this.contextService.context.runner.season;
    }

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
      [HeaderKeys.X_FORWARDED_FOR]: this.contextService.context.caller[HeaderKeys.X_FORWARDED_FOR]?.split(',')[0] || this.contextService.context.caller.remoteAddress,
    };
  }

}
