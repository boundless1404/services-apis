import { Module } from '@nestjs/common';
import { PaystackService } from './services/paystack_service.service';
import { SharedService } from '../shared/shared.service';
import { SharedModule } from '../shared/shared.module';
import { PaymentController } from './controller/payment.controller';

@Module({
  imports: [SharedModule],
  providers: [
    SharedService,
    PaystackService,
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
