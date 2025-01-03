import { PaystackWebhookEventObject } from '@/src/lib/types';
import { Body, Controller, Post, Headers } from '@nestjs/common';
import { PaystackService } from '../services/paystack_service.service';

@Controller('payment')
export class PaymentController {
  constructor(private paystackService: PaystackService) {
    //
  }
  // webhooks
  @Post('/services/paystack')
  async handlePaystackWebhookEvents(
    @Body() eventData: PaystackWebhookEventObject,
    @Headers('x-paystack-signature') webhookSignature: string,
  ) {
    await this.paystackService.handleWebhookEvent({
      eventData: eventData,
      webhookSignature,
    });
  }
}