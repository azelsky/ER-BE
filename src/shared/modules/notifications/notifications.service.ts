import { Injectable } from '@nestjs/common';

import { firebaseAdmin } from './firebase-admin.service';
import { INotificationPayload } from './models';

@Injectable()
export class NotificationsService {
  public async sendNotification(
    deviceToken: string,
    notificationPayload: INotificationPayload
  ): Promise<string> {
    const message = {
      webpush: {
        notification: {
          title: notificationPayload.title,
          body: notificationPayload.body,
          // toDO change to restaurant icon
          icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-84QJaofvWOR-Y_pUqut53hJ_-tkYiRBbWA&usqp=CAU'
        }
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
