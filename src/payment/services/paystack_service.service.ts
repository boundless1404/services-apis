import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaystackWebhookData, PaystackWebhookEventObject } from '@/src/lib/types';
import { createHmac } from 'crypto';
import { RequestService } from '@/src/shared/request/request.service';
import { SharedService } from '@/src/shared/shared.service';

// Extend the types to include transfer-related interfaces
interface PaystackTransferRecipient {
  type?: 'nuban'; // Bank account type
  name: string;
  account_number: string;
  bank_code: string;
  currency?: string;
}

interface PaystackTransferRequest {
  source?: string; // Transfer source (balance, typically)
  amount: number; // Amount in kobo (smallest currency unit)
  recipient?: string; // Optional Recipient code from create recipient API
  reason?: string; // Optional transfer reason
  reference: string;
}

@Injectable()
export class PaystackService {
  constructor(
    private readonly requestService: RequestService,
    private configService: ConfigService,
    private sharedService: SharedService,
  ) {
    this.baseURL = 'https://api.paystack.co';
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const paystackSecretKey = isProduction
      ? 'PAYSTACK_SECRET_KEY_LIVE'
      : 'PAYSTACK_SECRET_KEY_TEST';
    this.paystack_secret = this.configService.getOrThrow(paystackSecretKey);
  }

  baseURL: string;
  paystack_secret: string;

  /**
   * Gets basic request headers. Whether or not additonal headers are passed in,
   * an header object that includes authorization and content-type are returned
   * @param additionalHeaders Additional headers to pass in.
   * You may also override the authorization and content-type headers.
   * @returns Header object with at least the authorization and content-type.
   */
  private getHeaders(additionalHeaders?: Record<string, unknown>) {
    return {
      Authorization: `Bearer ${this.paystack_secret}`,
      'Content-Type': 'application/json',
      ...(additionalHeaders ? additionalHeaders : {}),
    };
  }

  async validatePaystackWebhookEvent(
    webhookSignature: string,
    eventData: Record<string, unknown>,
  ) {
    const hash = createHmac('sha512', this.paystack_secret)
      .update(JSON.stringify(eventData))
      .digest('hex');
    const isValid = hash === webhookSignature;
    return isValid;
  }

  async checkIsVirtualBankAccoountPayment(data: PaystackWebhookData) {
    const receivingBank = data.authorization.receiver_bank;
    const receivingBankAccount =
      data.authorization.receiver_bank_account_number;
    const isVirtualBankAccountPayment =
      !!receivingBank && !!receivingBankAccount;
    return isVirtualBankAccountPayment;
  }

  //   async createDedicatedVirtualAccount(
  //     dvaUserData: DedicatedVirtualAccountUserData,
  //   ) {
  //     const api_path = '/dedicated_account/assign';
  //     return (await this.requestService
  //       .setup(api_path, this.getHeaders())
  //       .send('POST', dvaUserData, this.baseURL)) as {
  //       status: boolean;
  //       message: string;
  //     };
  //   }

  //   async createDedicatedVirtualAccountSingleStep(data: SingleStepDVAUserData) {
  //     const api_path = '/dedicated_account/assign';
  //     return (
  //       (await this.requestService
  //         // .setOrUseDefaultBaseUrl(this.baseURL)
  //         .setup(api_path, this.getHeaders())
  //         .send('POST', data, this.baseURL)) as {
  //         status: boolean;
  //         message: string;
  //       }
  //     );
  //   }

  //   async createCustomer(userData: PaystackCustomer) {
  //     const api_path = '/customers';
  //     return (await this.requestService
  //       .setup(api_path, this.getHeaders())
  //       .send('POST', userData, this.baseURL)) as {
  //       data: { customer_code: string } & Record<string, unknown>;
  //     } & Record<string, unknown>;
  //   }

  /**
   * Create a transfer recipient
   * @param recipientData Details of the bank account to receive the transfer
   * @returns Recipient code and other details
   */
  async createTransferRecipient(recipientData: PaystackTransferRecipient) {
    const api_path = '/transferrecipient';
    const response = await this.requestService.sendRequest(api_path, {
      headers: this.getHeaders(),
      baseURL: this.baseURL,
      body: { ...recipientData, type: 'nuban' },
    });

    return response.data as {
      status: boolean;
      message: string;
      data: {
        recipient_code: string;
        details: {
          account_number: string;
          account_name: string;
          bank_code: string;
          bank_name: string;
        };
      };
    };
  }

  /**
   * Initiate a transfer to a previously created recipient
   * @param transferData Transfer details including amount and recipient
   * @returns Transfer initiation response
   */
  async initiateTransfer(transferData: PaystackTransferRequest) {
    const api_path = '/transfer';
    const response = await this.requestService.sendRequest(api_path, {
      headers: this.getHeaders(),
      baseURL: this.baseURL,
      body: { ...transferData, source: 'balance' },
    });
    return response.data as {
      status: boolean;
      message: string;
      data: {
        transfer_code: string;
        id: number;
        amount: number;
        currency: string;
        status: 'pending' | 'success' | 'failed';
      };
    };
  }

  // create transfer recipient
  // initiate transfer
  async makeTransfer(
    transferData: PaystackTransferRequest & PaystackTransferRecipient,
  ) {
    const recipient = await this.createTransferRecipient(transferData);
    const transfer = await this.initiateTransfer({
      ...transferData,
      recipient: recipient.data.recipient_code,
    });
    return transfer;
  }

  getPaystackPublicKey() {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const paystackPublicKey = isProduction
      ? 'PAYSTACK_PUBLIC_KEY_LIVE'
      : 'PAYSTACK_PUBLIC_KEY_TEST';

    return this.configService.get(paystackPublicKey);
  }

  async handleWebhookEvent({
      eventData,
      webhookSignature,
    }: {
      eventData: PaystackWebhookEventObject;
      webhookSignature: string;
    }) {
      // validate webhook event data
      const isValid = await this.validatePaystackWebhookEvent(
        webhookSignature,
        eventData,
      );
      if (!isValid) {
        return;
      }
  
      switch (eventData.event) {
        case 'charge.success':
          await this.chargeSuccess(eventData.data);
          break;
        // case 'dedicatedaccount.assign.success':
        //   await this.DVASucess(eventData.data, this.dbManager);
        //   break;
        // case 'transfer.success':
        //   await this.transferSuccess(eventData.data);
        //   break;
        // case 'transfer.failed':
        // case 'transfer.reversed':
        //   await this.transferFailedOrReversed(eventData.data);
      }
    }
  
    private async chargeSuccess(eventData: PaystackWebhookData) {
      //
      const reference = eventData.reference;
  let totalPrice = 0
      // check there is service booking with the reference
  
      const amountPaid = Number(eventData.amount) / 100;
      if (amountPaid < totalPrice) {
        return;
      }
  
      // send emails here
      const endTBTag = '</table>';
      const emailSender = this.sharedService.config.get('MAIL_SENDER_ACCOUNT');
      const adminEmail = this.sharedService.config.get(
        'MAIL_SENDER_ADMIN_USER_EMAIL',
      );
      const adminName = this.sharedService.config.get(
        'MAIL_SENDER_ADMIN_USER_NAME',
      );
  
      let emailBody = `
        <h1 style="color: purple;">Booking Summary</h1>
        <style>
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 24px;
        }
        th {
          background-color: #f2f2f2;
          color: purple;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr:hover {
          background-color: #ddd;
        }
        </style>
      `;

  
       
  
          // Send email to client
   
  
      await this.sharedService.sendZeptoEmail({
        to: [
          {
            email_address: {
              address: adminEmail,
              name: adminName,
            },
          },
        ],
        subject: 'Booking Confirmation',
        htmlbody: emailBody,
        from: { address: emailSender, name: 'Sender' },
      });
    }
  }
  
