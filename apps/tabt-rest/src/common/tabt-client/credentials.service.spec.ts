import { Test } from '@nestjs/testing';
import { CredentialsService } from './credentials.service';
import { ContextService } from '../context/context.service';
import { HeaderKeys } from '../context/context.constants';

describe('CredentialsService', () => {
  let service: CredentialsService;
  let contextService: ContextService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [{
        provide: ContextService, useValue: ({
          context: {},
        }),
      }, CredentialsService],
    }).compile();

    service = moduleRef.get<CredentialsService>(CredentialsService);
    contextService = moduleRef.get<ContextService>(ContextService);
  });

  describe('enrichInputWithCredentials', () => {
    it('should enrich the given input with headers set in the context of the request', () => {
      const input = {
        test: 'It\'s the test',
      };
      Object.defineProperty(contextService, 'context', {
        value: {
          runner: {
            name: 'test',
            version: '1.0.0',
            pid: 1234,
            season: 23
          },
          caller: {
            correlationId: '123',
            'X-Tabt-Account': 'florent',
            'X-Tabt-Password': 'the password',
            'X-Tabt-Season': '18',
            'X-Tabt-OnBehalfOf': 'on behalf of ...',
          },
        },
      });

      const result = service.enrichInputWithCredentials(input);

      expect(result).toEqual({
        'Credentials': {
          'Account': 'florent',
          // 'OnBehalfOf': 'on behalf of ...',
          'Password': 'the password',
        },
        'Season': 18,
        'test': 'It\'s the test',
      });
    });

    it('should only add 22 as current season if nothing given', () => {
      const input = {
        test: 'It\'s the test',
      };
      Object.defineProperty(contextService, 'context', {
        value: {
          runner: {
            name: 'test',
            version: '1.0.0',
            pid: 1234,
            season: 23
          },
          caller: {
            correlationId: '123',
          },
        },
      });

      const result = service.enrichInputWithCredentials(input);

      expect(result).toEqual({
        'test': 'It\'s the test',
        'Season': 23
      });
    });

  });
  describe('extraHeaders', () => {
    it('should set x-forwarded-host to the received one', () => {
      Object.defineProperty(contextService, 'context', {
        value: {
          runner: {
            name: 'test',
            version: '1.0.0',
            pid: 1234,
          },
          caller: {
            correlationId: '123',
            [HeaderKeys.X_FORWARDED_FOR]: '12.12.12.12',
            'remoteAddress': '11.11.11.11',
          },
        },
      });

      const result = service.extraHeaders;

      expect(result).toEqual({
        [HeaderKeys.X_FORWARDED_FOR]: '12.12.12.12',
      });
    });
    it('should set x-forwarded-host to the remote address', () => {
      Object.defineProperty(contextService, 'context', {
        value: {
          runner: {
            name: 'test',
            version: '1.0.0',
            pid: 1234,
          },
          caller: {
            correlationId: '123',
            'remoteAddress': '11.11.11.11',
          },
        },
      });

      const result = service.extraHeaders;

      expect(result).toEqual({
        [HeaderKeys.X_FORWARDED_FOR]: '11.11.11.11',
      });
    });
  });
});
