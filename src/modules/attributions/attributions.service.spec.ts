import { Test, TestingModule } from '@nestjs/testing';
import { AttributionsService } from './attributions.service';

describe('AttributionsService', () => {
  let service: AttributionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttributionsService],
    }).compile();

    service = module.get<AttributionsService>(AttributionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
