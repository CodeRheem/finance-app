import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('test')
  async test(@Body() body: { deviceToken: string; title: string; body: string }) {
    return this.notificationsService.sendPushNotification(
      body.deviceToken,
      body.title,
      body.body,
    );
  }
}