import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function TabtHeaders() {
  return applyDecorators(
    ApiHeader({
      name: 'x-tabt-account',
      description: "Account to do a request"
    }),
    ApiHeader({
      name: 'x-tabt-password',
      description: "Password of the account"
    }),
    ApiHeader({
      name: 'x-tabt-onbehalfof',
      description: "On Behalf of"
    })
  );
}
