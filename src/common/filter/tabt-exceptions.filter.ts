import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { OperationalError } from 'bluebird';
import { ApiProperty } from '@nestjs/swagger';

export class TabtException {
  @ApiProperty()
  errorCode: number;
  @ApiProperty()
  message: string;
}

@Catch(OperationalError)
export class TabtExceptionsFilter implements ExceptionFilter {
  catch(exception: OperationalError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const [errorCode, errorMessage] = exception.message.split(': ');

    response.status(400).json({
      errorCode: parseInt(errorCode),
      message: errorMessage,
    }).end();
  }
}
