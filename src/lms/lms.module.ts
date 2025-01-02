import { Module } from '@nestjs/common';
import { LmsController } from './controller/lms.controller';
import { LmsService } from './service/lms.service';

@Module({
  controllers: [LmsController],
  providers: [LmsService]
})
export class LmsModule {}
