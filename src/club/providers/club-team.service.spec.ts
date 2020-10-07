import { Test, TestingModule } from '@nestjs/testing';
import { ClubTeamService } from './club-team.service';

describe('ClubTeamService', () => {
  let provider: ClubTeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubTeamService],
    }).compile();

    provider = module.get<ClubTeamService>(ClubTeamService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
