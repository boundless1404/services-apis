import { Test, TestingModule } from '@nestjs/testing';
import { ErranderService } from './errander.service';

describe('ErranderService', () => {
  let service: ErranderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErranderService],
    }).compile();

    service = module.get<ErranderService>(ErranderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
