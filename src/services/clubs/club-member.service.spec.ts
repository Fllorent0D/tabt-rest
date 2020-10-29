import { Test, TestingModule } from '@nestjs/testing';
import { ClubMemberService } from './club-member.service';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';

describe('ClubMemberService', () => {
  let provider: ClubMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubMemberService,
        {
          provide: TabtClientService,
          useValue: {
            GetSeasonsAsync: jest.fn()
          }
        }
      ],
    }).compile();

    provider = module.get<ClubMemberService>(ClubMemberService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
