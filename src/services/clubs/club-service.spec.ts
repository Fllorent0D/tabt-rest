import { Test, TestingModule } from '@nestjs/testing';
import { ClubService } from './club.service';

describe('Club', () => {
  let provider: ClubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubService],
    }).compile();

    provider = module.get<ClubService>(ClubService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
