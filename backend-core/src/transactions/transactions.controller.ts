import { Body, Controller, Get, Inject, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { TRANSACTION_REPOSITORY } from './repositories/transaction-repository.token';
import type { ITransactionRepository } from './repositories/transaction-repository.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from '../notifications/notifications.service';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(
    @Inject(TRANSACTION_REPOSITORY) private readonly transactionRepository: ITransactionRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post()
  async create(
    @Body()
    body: {
      accountId: string;
      amount: number;
      type: string;
      description?: string;
      deviceToken?: string;
    },
  ) {
    const transaction = await this.transactionRepository.create({
      accountId: body.accountId,
      amount: body.amount,
      type: body.type,
      description: body.description,
    });

    if (body.deviceToken) {
      await this.notificationsService.sendPushNotification(
        body.deviceToken,
        'Transaction Alert',
        `A ${body.type} of ${body.amount} was recorded on your account.`,
      );
    }

    return transaction;
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  @Get('account/:accountId')
  async findByAccountId(@Param('accountId') accountId: string) {
    return this.transactionRepository.findByAccountId(accountId);
  }
}