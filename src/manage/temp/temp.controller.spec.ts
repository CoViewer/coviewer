import { Test, TestingModule } from '@nestjs/testing';
import { TempController } from './temp.controller';

describe('TempController', () => {
  let controller: TempController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TempController],
    }).compile();

    controller = module.get<TempController>(TempController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
