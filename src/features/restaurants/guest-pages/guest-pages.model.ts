import { UUIDV4 } from 'sequelize';
import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { PRIMARY_COLOR } from '@shared/constants';

import { Restaurant } from '../restaurants.model';

interface GuestPageCreationAttr {
  restaurantId: string;
}

@Table({ tableName: 'guest_pages', createdAt: false, updatedAt: false })
export class GuestPage
  extends Model<GuestPage, GuestPageCreationAttr>
  implements GuestPageCreationAttr
{
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  })
  id: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    defaultValue: PRIMARY_COLOR['700']
  })
  successBackground: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    defaultValue: PRIMARY_COLOR['50']
  })
  successTextColor: string;

  @ForeignKey(() => Restaurant)
  @Column({ type: DataType.UUID, allowNull: false })
  restaurantId: string;
}
