import { ApiProperty } from '@nestjs/swagger';

export enum RESPONSE_STATUS {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
}

export class ResponseDTO<T> {
  @ApiProperty({ description: 'The status of the response' })
  public readonly status: RESPONSE_STATUS;

  @ApiProperty({ description: 'The payload of the response' })
  public readonly payload: T | undefined;

  @ApiProperty({ description: 'The error message, if any', required: false })
  public readonly error?: string;

  static success<T>(payload: T): ResponseDTO<T> {
    return new ResponseDTO<T>(RESPONSE_STATUS.SUCCESS, payload);
  }

  static error(error: string): ResponseDTO<string> {
    return new ResponseDTO<string>(RESPONSE_STATUS.ERROR, null, error);
  }

  constructor(status: RESPONSE_STATUS, payload: T | undefined, error?: string) {
    this.status = status;
    this.payload = payload;
    this.error = error;
  }
}
