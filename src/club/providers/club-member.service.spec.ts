import { Test, TestingModule } from '@nestjs/testing';
import { ClubMemberService } from './club-member.service';

describe('ClubMemberService', () => {
  let provider: ClubMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubMemberService],
    }).compile();

    provider = module.get<ClubMemberService>(ClubMemberService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
