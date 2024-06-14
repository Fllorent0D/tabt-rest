export enum RESPONSE_STATUS {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
}

export class ResponseDTO<T> {
  constructor(
    public readonly status: RESPONSE_STATUS,
    public readonly payload: T | undefined,
    public readonly error?: string,
  ) {}
}
