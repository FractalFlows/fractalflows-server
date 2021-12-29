import { Test, TestingModule } from '@nestjs/testing';
import { AttributionsResolver } from './attributions.resolver';
import { AttributionsService } from './attributions.service';

describe('AttributionsResolver', () => {
  let resolver: AttributionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttributionsResolver, AttributionsService],
    }).compile();

    resolver = module.get<AttributionsResolver>(AttributionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
