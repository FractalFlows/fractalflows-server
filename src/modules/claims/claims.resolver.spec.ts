import { Test, TestingModule } from '@nestjs/testing';
import { ClaimsResolver } from './claims.resolver';
import { ClaimsService } from './claims.service';

describe('ClaimsResolver', () => {
  let resolver: ClaimsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClaimsResolver, ClaimsService],
    }).compile();

    resolver = module.get<ClaimsResolver>(ClaimsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
