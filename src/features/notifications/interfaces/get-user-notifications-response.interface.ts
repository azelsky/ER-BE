import { INotificationData } from './notification-data.interface';
import { NotificationTypeEnum } from './notification-type.enum';

export interface INotification {
  isNew: boolean;
  data: INotificationData;
  type: NotificationTypeEnum;
  createdAt: Date;
  id: string;
}
