import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentCommentsService } from './argument-comments.service';

describe('ArgumentCommentsService', () => {
  let service: ArgumentCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArgumentCommentsService],
    }).compile();

    service = module.get<ArgumentCommentsService>(ArgumentCommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
