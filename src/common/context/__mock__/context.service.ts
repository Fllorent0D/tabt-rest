import { Context } from '../context.contract';
import { HeaderKeys } from '../context.constants';

export class ContextService {

  context: Context = {
    runner: {
      name: 'test',
      version: '1,0,0',
      pid: 1234,
      season: 23,
    },
    caller: {
      correlationId: '123',
      remoteAddress: '12.12.12.12',
      [HeaderKeys.X_FORWARDED_FOR]: '11.11.11.11',
    },
  };

  constructor() {
    this.context = this.createContext(null);
  }


  registerHttpHeaders(httpHeadersList: string[]) {
    return;
  }

  private createContext(request: Express.Request): Context {
    return {
      runner: {
        name: 'test',
        version: '1,0,0',
        pid: 1234,
        season: 23,
      },
      caller: {
        correlationId: '123',
        remoteAddress: '12.12.12.12',
        [HeaderKeys.X_FORWARDED_FOR]: '11.11.11.11',
      },
    };
  }

}
