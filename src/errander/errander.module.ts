import { Module } from '@nestjs/common';
import { ErranderService } from './service/errander.service';
import { ErranderController } from './controller/errander.controller';

@Module({
  providers: [ErranderService],
  controllers: [ErranderController]
})
export class ErranderModule {}
