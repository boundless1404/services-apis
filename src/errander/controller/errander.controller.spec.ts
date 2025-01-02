import { Test, TestingModule } from '@nestjs/testing';
import { ErranderController } from './errander.controller';

describe('ErranderController', () => {
  let controller: ErranderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ErranderController],
    }).compile();

    controller = module.get<ErranderController>(ErranderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
