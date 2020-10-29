import { Test, TestingModule } from '@nestjs/testing';
import { ClubService } from './club.service';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';

describe('Club', () => {
  let provider: ClubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubService,
        {
          provide: TabtClientService,
          useValue: {
            GetSeasonsAsync: jest.fn()
          }
        }
        ],
    }).compile();

    provider = module.get<ClubService>(ClubService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
