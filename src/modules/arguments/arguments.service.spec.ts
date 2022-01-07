import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentsService } from './arguments.service';

describe('ArgumentsService', () => {
  let service: ArgumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArgumentsService],
    }).compile();

    service = module.get<ArgumentsService>(ArgumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
