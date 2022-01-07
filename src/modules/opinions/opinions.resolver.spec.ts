import { Test, TestingModule } from '@nestjs/testing';
import { OpinionsResolver } from './opinions.resolver';
import { OpinionsService } from './opinions.service';

describe('OpinionsResolver', () => {
  let resolver: OpinionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpinionsResolver, OpinionsService],
    }).compile();

    resolver = module.get<OpinionsResolver>(OpinionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
