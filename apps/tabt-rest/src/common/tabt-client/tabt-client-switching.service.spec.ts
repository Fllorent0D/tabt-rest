import { Test } from '@nestjs/testing';
import { TabtClientSwitchingService } from './tabt-client-switching.service';
import {
  DatabaseContextService,
  TABT_DATABASE,
} from '../context/database-context.service';

jest.mock('../context/database-context.service');

describe('TabtClientSwitchingService', () => {
  let service: TabtClientSwitchingService;
  let databaseContextService: DatabaseContextService;
  const afttClient = {};
  const vttlClient = {};
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DatabaseContextService,
        {
          provide: 'tabt-aftt',
          useValue: afttClient,
        },
        {
          provide: 'tabt-vttl',
          useValue: vttlClient,
        },
        TabtClientSwitchingService,
      ],
    }).compile();

    service = moduleRef.get<TabtClientSwitchingService>(
      TabtClientSwitchingService,
    );
    databaseContextService = moduleRef.get<DatabaseContextService>(
      DatabaseContextService,
    );
  });

  describe('get tabtClient', () => {
    it('tabtClient should returns AFTT client if database context is AFTT', () => {
      Object.defineProperty(databaseContextService, 'database', {
        get() {
          return TABT_DATABASE.AFTT;
        },
      });

      const tabtClient = service.tabtClient;

      expect(tabtClient).toBeDefined();
      expect(tabtClient).toBe(afttClient);
    });

    it('tabtClient should returns VTTL client if database context is VTTL', () => {
      Object.defineProperty(databaseContextService, 'database', {
        get() {
          return TABT_DATABASE.VTTL;
        },
      });

      const tabtClient = service.tabtClient;

      expect(tabtClient).toBeDefined();
      expect(tabtClient).toBe(vttlClient);
    });
  });
});
