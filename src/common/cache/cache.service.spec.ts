import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let provider: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheService],
    }).compile();

    provider = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
