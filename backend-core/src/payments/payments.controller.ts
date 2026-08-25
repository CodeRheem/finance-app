import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('paystack/initialize')
  async initialize(@Body() body: { email: string; amount: number }) {
    const amountInKobo = Math.round(body.amount * 100);
    return this.paymentsService.initializePayment(body.email, amountInKobo);
  }
}