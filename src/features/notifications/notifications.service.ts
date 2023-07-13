import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { UsersService } from '@features/users/users.service';

import { firebaseAdmin } from './firebase-admin.service';
import {
  INotification,
  INotificationData,
  INotificationPayload,
  NotificationTypeEnum
} from './interfaces';
import { Notification } from './notification.model';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification) private _notificationRepository: typeof Notification,
    private readonly _usersService: UsersService
  ) {}

  public async getUserNotifications(cognitoId: string): Promise<INotification[]> {
    const user = await this._usersService.getUserByCognitoId(cognitoId);
    const attributes: (keyof Notification)[] = ['data', 'type', 'isNew', 'createdAt', 'id'];
    const orderField: keyof Notification = 'createdAt';

    const notifications = await this._notificationRepository.findAll({
      where: { userId: user.id },
      attributes,
      order: [[orderField, 'DESC']]
    });

    await this._notificationRepository.update(
      { isNew: false },
      { where: { userId: user.id, isNew: true } }
    );

    return notifications;
  }

  public async getNewUserNotificationsCount(cognitoId: string): Promise<number> {
    const user = await this._usersService.getUserByCognitoId(cognitoId);

    return this._notificationRepository.count({ where: { userId: user.id, isNew: true } });
  }

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
  ): Promise<void> {
    const message = {
      webpush: {
        notification: {
          title: notificationPayload.title,
          body: notificationPayload.body,
          icon: 'https://www.app.qringer.com/assets/logo.svg',
          sound: 'default'
        }
      },
      data: {
        additionalDataKey: 'additionalDataValue'
      }
    };

    try {
      await firebaseAdmin.messaging().send({
        token: deviceToken,
        ...message
      });
    } catch (e) {
      console.log(e);
    }
  }
}
