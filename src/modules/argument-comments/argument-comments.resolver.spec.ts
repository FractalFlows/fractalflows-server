import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentCommentsResolver } from './argument-comments.resolver';
import { ArgumentCommentsService } from './argument-comments.service';

describe('ArgumentCommentsResolver', () => {
  let resolver: ArgumentCommentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArgumentCommentsResolver, ArgumentCommentsService],
    }).compile();

    resolver = module.get<ArgumentCommentsResolver>(ArgumentCommentsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
