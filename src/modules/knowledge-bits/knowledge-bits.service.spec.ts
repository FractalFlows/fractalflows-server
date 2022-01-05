import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgeBitService } from './knowledge-bits.service';

describe('KnowledgeBitService', () => {
  let service: KnowledgeBitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KnowledgeBitService],
    }).compile();

    service = module.get<KnowledgeBitService>(KnowledgeBitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
