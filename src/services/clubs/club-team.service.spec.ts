import { Test, TestingModule } from '@nestjs/testing';
import { ClubTeamService } from './club-team.service';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';

describe('ClubTeamService', () => {
  let provider: ClubTeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubTeamService,
        {
          provide: TabtClientService,
          useValue: {
            GetSeasonsAsync: jest.fn()
          }
        }
        ],
    }).compile();

    provider = module.get<ClubTeamService>(ClubTeamService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
