import { TabtExceptionsFilter } from './tabt-exceptions.filter';
import { OperationalError } from 'bluebird';
import { ArgumentsHost } from '@nestjs/common';

describe('TabtFilter', () => {
  let filter: TabtExceptionsFilter;
  beforeEach(() => {
    filter = new TabtExceptionsFilter();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should be reponds 400 with error code and error message', () => {
    const exception = new OperationalError('9: Club [L23423] is not valid.');
    const httpResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    };
    const ctx = {
      switchToHttp: () => ({
        getResponse: () => httpResponse,
      }),
    };

    filter.catch(exception, ctx as ArgumentsHost);

    expect(httpResponse.status).toHaveBeenCalledWith(400);
    expect(httpResponse.json).toHaveBeenCalledWith({
      'errorCode': 9,
      'message': 'Club [L23423] is not valid.',
      'statusCode': 400,
    });
    expect(httpResponse.end).toHaveBeenCalledTimes(1);
  });
});
