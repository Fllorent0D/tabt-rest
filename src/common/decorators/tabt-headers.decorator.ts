import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { HeaderKeys } from '../context/context.constants';
import { TABT_LANGUAGE } from '../context/database-context.service';

export function TabtHeadersDecorator() {
  return applyDecorators(
    ApiHeader({
      name: HeaderKeys.X_TABT_ACCOUNT,
      description: "Account to do a request"
    }),
    ApiHeader({
      name: HeaderKeys.X_TABT_PASSWORD,
      description: "Password of the account"
    }),
    ApiHeader({
      name: HeaderKeys.X_TABT_ONBEHALFOF,
      description: "On Behalf of"
    }),
    ApiHeader({
      name: HeaderKeys.X_TABT_DATABASE,
      enum:[TABT_LANGUAGE.AFTT, TABT_LANGUAGE.VTTL],
      description: "Language"
    })
  );
}
