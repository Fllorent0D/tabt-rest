import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { Credentials } from '../../entity/tabt/TabTAPI_Port';


export const TabtCredentials = createParamDecorator(
  (data: never, ctx: ExecutionContext): Credentials => {
    const request: IncomingMessage = ctx.switchToHttp().getRequest();
    console.log(request);
    return {
      Account: request.headers['x-tabt-account'] as string,
      Password: request.headers['x-tabt-password'] as string
    } as Credentials;
  },
);
