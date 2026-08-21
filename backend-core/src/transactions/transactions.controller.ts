import { Body, Controller, Get, Inject, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { TRANSACTION_REPOSITORY } from './repositories/transaction-repository.token';
import type { ITransactionRepository } from './repositories/transaction-repository.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(
    @Inject(TRANSACTION_REPOSITORY) private readonly transactionRepository: ITransactionRepository,
  ) {}

  @Post()
  async create(@Body() body: { accountId: string; amount: number; type: string; description?: string }) {
    return this.transactionRepository.create(body);
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