import { Injectable, Logger } from '@nestjs/common';
import { getMessaging } from 'firebase-admin/messaging';
import firebaseApp from './firebase';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async sendPushNotification(deviceToken: string, title: string, body: string) {
    const message = {
      token: deviceToken,
      notification: {
        title,
        body,
      },
    };

    try {
      const response = await getMessaging(firebaseApp).send(message);
      return { success: true, messageId: response };
    } catch (error: any) {
      this.logger.warn(`Push notification failed: ${error.message}`);
      return { success: false, error: error.code ?? 'unknown_error' };
    }
  }
}