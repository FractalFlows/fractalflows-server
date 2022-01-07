import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentsResolver } from './arguments.resolver';
import { ArgumentsService } from './arguments.service';

describe('ArgumentsResolver', () => {
  let resolver: ArgumentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArgumentsResolver, ArgumentsService],
    }).compile();

    resolver = module.get<ArgumentsResolver>(ArgumentsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
