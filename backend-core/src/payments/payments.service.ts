import { Inject, Injectable, InternalServerErrorException, UnauthorizedException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { ACCOUNT_REPOSITORY } from '../accounts/repositories/account-repository.token';
import type { IAccountRepository } from '../accounts/repositories/account-repository.interface';
import { TRANSACTION_REPOSITORY } from '../transactions/repositories/transaction-repository.token';
import type { ITransactionRepository } from '../transactions/repositories/transaction-repository.interface';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly secretKey = process.env.PAYSTACK_SECRET_KEY;

  constructor(
    @Inject(ACCOUNT_REPOSITORY) private readonly accountRepository: IAccountRepository,
    @Inject(TRANSACTION_REPOSITORY) private readonly transactionRepository: ITransactionRepository,
  ) {}

  async initializePayment(email: string, amountInKobo: number, accountId: string) {
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: amountInKobo,
      metadata: { accountId },
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
      const amountInKobo = parsedBody.data.amount;
      const amountInNaira = amountInKobo / 100;
      const accountId = parsedBody.data.metadata?.accountId;

      if (!accountId) {
        this.logger.warn(`Webhook received with no accountId in metadata, reference: ${reference}`);
        return { received: true };
      }

      const account = await this.accountRepository.findById(accountId);
      if (!account) {
        this.logger.warn(`Account not found for webhook, accountId: ${accountId}`);
        return { received: true };
      }

      await this.accountRepository.updateBalance(accountId, account.balance + amountInNaira);

      await this.transactionRepository.create({
        accountId,
        amount: amountInNaira,
        type: 'credit',
        description: `Paystack payment - ${reference}`,
      });

      this.logger.log(`Payment confirmed and account credited: ${reference}, amount: ₦${amountInNaira}`);
    }

    return { received: true };
  }
}