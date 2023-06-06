import { Test, TestingModule } from '@nestjs/testing';
import { ThumbController } from './thumb.controller';

describe('ThumbController', () => {
  let controller: ThumbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThumbController],
    }).compile();

    controller = module.get<ThumbController>(ThumbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
