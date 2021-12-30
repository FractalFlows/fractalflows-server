import { Test, TestingModule } from '@nestjs/testing';
import { SourcesResolver } from './sources.resolver';
import { SourcesService } from './sources.service';

describe('SourcesResolver', () => {
  let resolver: SourcesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SourcesResolver, SourcesService],
    }).compile();

    resolver = module.get<SourcesResolver>(SourcesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
