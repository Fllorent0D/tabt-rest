import { Context } from '../context.contract';

export class ContextService {

  context: Context;

  registerHttpHeaders(httpHeadersList: string[]) {
    return;
  }

  private createContext(request: Express.Request): Context {
    return {
      runner: {
        name: 'test',
        version: '1,0,0',
        pid: 1234,
      },
      caller: {
        correlationId: '123',
      },
    };
  }

}
