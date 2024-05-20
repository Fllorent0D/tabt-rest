import { Test } from '@nestjs/testing';
import { DatabaseContextService, DEFAULT_LANG, TABT_DATABASE } from './database-context.service';
import { ContextService } from './context.service';

describe('DatabaseContextService', () => {
  let service: DatabaseContextService;
  let contextService: ContextService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [{
        provide: ContextService, useValue: ({
          context: {}
        }),
      }, DatabaseContextService],
    }).compile();

    service = moduleRef.get<DatabaseContextService>(DatabaseContextService);
    contextService = moduleRef.get<ContextService>(ContextService);
  });

  describe('database', () => {
    it('should return default database if no context for the request', async () => {
      Object.defineProperty(contextService, 'context', {value: {
          runner: {
            name: 'test',
            version: '1.0.0',
            pid: 1234,
          },
          caller: {
            correlationId: '123',
          },
        }})

      expect(service).toBeDefined();
      expect(service.database).toBe(DEFAULT_LANG)
    });

    it('should return AFTT database if passed in context for the request', async () => {
      Object.defineProperty(contextService, 'context', {value: {
          runner: {
            name: 'test',
            version: '1.0.0',
            pid: 1234,
          },
          caller: {
            correlationId: '123',
            'X-Tabt-Database': 'aftt'
          },
        }})

      expect(service).toBeDefined();
      expect(service.database).toBe(TABT_DATABASE.AFTT)
    });

    it('should return VTTL database if passed in context for the request', async () => {
      Object.defineProperty(contextService, 'context', {value: {
          runner: {
            name: 'test',
            version: '1.0.0',
            pid: 1234,
          },
          caller: {
            correlationId: '123',
            'X-Tabt-Database': 'vttl'
          },
        }})

      expect(service).toBeDefined();
      expect(service.database).toBe(TABT_DATABASE.VTTL)
    });
  });
});
