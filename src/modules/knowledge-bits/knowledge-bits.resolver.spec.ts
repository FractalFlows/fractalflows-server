import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgeBitResolver } from './knowledge-bits.resolver';
import { KnowledgeBitService } from './knowledge-bits.service';

describe('KnowledgeBitResolver', () => {
  let resolver: KnowledgeBitResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KnowledgeBitResolver, KnowledgeBitService],
    }).compile();

    resolver = module.get<KnowledgeBitResolver>(KnowledgeBitResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
