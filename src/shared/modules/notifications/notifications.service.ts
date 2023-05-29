import { Injectable } from '@nestjs/common';
import { messaging } from 'firebase-admin';

import { firebaseAdmin } from './firebase-admin.service';
import { INotificationPayload } from './models';

@Injectable()
export class NotificationsService {
  public async sendNotification(
    deviceToken: string,
    notificationPayload: INotificationPayload
  ): Promise<string> {
    const message: messaging.MessagingPayload = {
      notification: {
        title: notificationPayload.title,
        body: notificationPayload.body
      },
      data: {
        additionalDataKey: 'additionalDataValue'
      }
    };

    const response = await firebaseAdmin.messaging().send({
      token: deviceToken,
      ...message
    });

    return response;
  }
}
