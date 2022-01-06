import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgeBitVotesService } from './knowledge-bit-votes.service';

describe('KnowledgeBitVotesService', () => {
  let service: KnowledgeBitVotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KnowledgeBitVotesService],
    }).compile();

    service = module.get<KnowledgeBitVotesService>(KnowledgeBitVotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
