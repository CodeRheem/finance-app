import { Body, Controller, Headers, Post, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('paystack/initialize')
  async initialize(@Body() body: { email: string; amount: number }) {
    const amountInKobo = Math.round(body.amount * 100);
    return this.paymentsService.initializePayment(body.email, amountInKobo);
  }

  @Post('paystack/webhook')
  async handleWebhook(
    @Headers('x-paystack-signature') signature: string,
    @Req() request: Request & { rawBody?: Buffer },
  ) {
    return this.paymentsService.handlePaystackWebhook(signature, request.rawBody!, request.body);
  }
}