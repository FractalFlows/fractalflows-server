import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgeBitVotesResolver } from './knowledge-bit-votes.resolver';
import { KnowledgeBitVotesService } from './knowledge-bit-votes.service';

describe('KnowledgeBitVotesResolver', () => {
  let resolver: KnowledgeBitVotesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KnowledgeBitVotesResolver, KnowledgeBitVotesService],
    }).compile();

    resolver = module.get<KnowledgeBitVotesResolver>(KnowledgeBitVotesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
