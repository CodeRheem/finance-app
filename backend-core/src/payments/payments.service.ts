import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class PaymentsService {
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
}