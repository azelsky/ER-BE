import { UUIDV4 } from 'sequelize';
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { TMessengerType } from './waiters.interfaces';
import { Restaurant } from '../restaurants.model';

interface WaiterCreationAttr {
  name: string;
  confirmationCode: string;
  restaurantId: string;
}

@Table({ tableName: 'waiters', createdAt: false, updatedAt: false })
export class Waiter extends Model<Waiter, WaiterCreationAttr> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name: string;

  @Column({
    type: DataType.STRING,
    field: 'messenger_user_id'
  })
  messengerUserId: string;

  @Column({
    type: DataType.STRING,
    field: 'messenger_type'
  })
  messengerType: TMessengerType;

  @Column({
    type: DataType.STRING,
    field: 'confirmation_code'
  })
  confirmationCode: string;

  @Column({
    type: DataType.BOOLEAN,
    field: 'is_working',
    defaultValue: true
  })
  isWorking: boolean;

  @ForeignKey(() => Restaurant)
  @Column({ type: DataType.UUID, allowNull: false, field: 'restaurant_id' })
  restaurantId: string;

  @BelongsTo(() => Restaurant, { onDelete: 'CASCADE' })
  restaurant: Restaurant;
}
