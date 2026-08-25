import { Injectable, InternalServerErrorException, UnauthorizedException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly secretKey = process.env.PAYSTACK_SECRET_KEY;

  async initializePayment(email: string, amountInKobo: number) {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountInKobo,
      }),
    });

    const data = await response.json();

    if (!data.status) {
      throw new InternalServerErrorException(data.message || 'Payment initialization failed');
    }

    return {
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
    };
  }

  async handlePaystackWebhook(signature: string, rawBody: Buffer, parsedBody: any) {
    const expectedSignature = crypto
      .createHmac('sha512', this.secretKey!)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      this.logger.warn('Webhook signature mismatch — possible spoofed request');
      throw new UnauthorizedException('Invalid signature');
    }

    const event = parsedBody.event;

    if (event === 'charge.success') {
      const reference = parsedBody.data.reference;
      const amount = parsedBody.data.amount;
      this.logger.log(`Payment confirmed: ${reference}, amount: ${amount} kobo`);
      // TODO: mark the corresponding transaction/account as paid in your database
    }

    return { received: true };
  }
}