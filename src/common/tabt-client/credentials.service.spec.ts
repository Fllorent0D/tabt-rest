import { Test } from '@nestjs/testing';
import { CredentialsService } from './credentials.service';
import { ContextService } from '../context/context.service';

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
          },
          caller: {
            correlationId: '123',
            'X-Tabt-Account': 'florent',
            'X-Tabt-Password': 'the password',
            'X-Tabt-OnBehalfOf': 'on behalf of ...',
          },
        },
      });

      const result = service.enrichInputWithCredentials(input);

      expect(result).toEqual({
        'Credentials': {
          'Account': 'florent',
          'OnBehalfOf': 'on behalf of ...',
          'Password': 'the password',
        },
        'test': 'It\'s the test',
      });
    });

    it('should not add anything if nothing given', () => {
      const input = {
        test: 'It\'s the test',
      };
      Object.defineProperty(contextService, 'context', {
        value: {
          runner: {
            name: 'test',
            version: '1.0.0',
            pid: 1234,
          },
          caller: {
            correlationId: '123',
          },
        },
      });

      const result = service.enrichInputWithCredentials(input);

      expect(result).toEqual({
        'test': 'It\'s the test',
      });
    });

  });
});
