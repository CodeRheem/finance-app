import { Body, Controller, Get, Inject, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { ACCOUNT_REPOSITORY } from './repositories/account-repository.token';
import type { IAccountRepository } from './repositories/account-repository.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(
    @Inject(ACCOUNT_REPOSITORY) private readonly accountRepository: IAccountRepository,
  ) {}

  @Post()
  async create(@Body() body: { userId: string; accountName: string; currency?: string }) {
    return this.accountRepository.create(body);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const account = await this.accountRepository.findById(id);
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.accountRepository.findByUserId(userId);
  }
}
