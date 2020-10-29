import { Test, TestingModule } from '@nestjs/testing';
import { DivisionService } from './division.service';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';

describe('DivisionsService', () => {
  let service: DivisionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DivisionService,
        {
          provide: TabtClientService,
          useValue: {
            GetSeasonsAsync: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<DivisionService>(DivisionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
