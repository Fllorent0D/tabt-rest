import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { OperationalError } from 'bluebird';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DatadogService } from '../logger/datadog.service';

export class TabtException {
  @ApiPropertyOptional()
  errorCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty()
  statusCode: number;
}

@Catch(OperationalError)
export class TabtExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly datadog: DatadogService
  ) {
  }
  catch(exception: OperationalError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const [errorCode, errorMessage] = exception.message.split(': ');
    this.datadog.statsD?.event('tabt-error', exception.message, {alert_type: 'error'})
    response.status(400).json({
      statusCode: 400,
      errorCode: parseInt(errorCode),
      message: errorMessage,
    }).end();
  }
}
