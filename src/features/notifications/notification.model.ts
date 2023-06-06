import { UUIDV4 } from 'sequelize';
import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { User } from '@features/users/users.model';

import { INotificationData, NotificationTypeEnum } from './interfaces';

interface NotificationCreationAttr {
  userId: string;
  type: NotificationTypeEnum;
  data: INotificationData;
}

@Table({ tableName: 'notifications', updatedAt: false })
export class Notification
  extends Model<Notification, NotificationCreationAttr>
  implements NotificationCreationAttr
{
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  })
  id: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, field: 'is_new', defaultValue: true })
  isNew: boolean;

  @Column({ type: DataType.STRING, allowNull: false })
  type: NotificationTypeEnum;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId: string;

  @Column({ field: 'created_at' })
  createdAt: Date;

  @Column({ type: DataType.JSON, allowNull: true })
  data: INotificationData;
}
