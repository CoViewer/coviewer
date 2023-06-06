import { Test, TestingModule } from '@nestjs/testing';
import { ThumbService } from './thumb.service';

describe('ThumbService', () => {
  let service: ThumbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThumbService],
    }).compile();

    service = module.get<ThumbService>(ThumbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
