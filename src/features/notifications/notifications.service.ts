import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { firebaseAdmin } from './firebase-admin.service';
import { INotificationData, INotificationPayload, NotificationTypeEnum } from './interfaces';
import { Notification } from './notification.model';

@Injectable()
export class NotificationsService {
  constructor(@InjectModel(Notification) private _notificationRepository: typeof Notification) {}

  public async sendNotification(
    recipientId: string,
    recipientDeviceIds: string[],
    type: NotificationTypeEnum,
    data: INotificationData,
    notificationPayload: INotificationPayload
  ): Promise<void> {
    await this._notificationRepository.create({ type, data, userId: recipientId });

    for (const recipientDeviceId of recipientDeviceIds) {
      await this._sendPushNotification(recipientDeviceId, notificationPayload);
    }
  }

  private async _sendPushNotification(
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
