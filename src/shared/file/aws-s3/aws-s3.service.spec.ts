import { Test, TestingModule } from '@nestjs/testing';
import { AwsS3V2Service } from './aws-s3.service';

describe('AwsS3Service', () => {
  let service: AwsS3V2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsS3V2Service],
    }).compile();

    service = module.get<AwsS3V2Service>(AwsS3V2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
