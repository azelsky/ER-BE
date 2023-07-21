import { UUIDV4 } from 'sequelize';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript';

import { Restaurant } from '@features/restaurants/restaurants.model';

import { ZoneTable } from './zone-table.model';
import { ZoneWaiter } from './zone-waiter.model';
import { RTable } from '../tables/tables.model';
import { Waiter } from '../waiters/waiters.model';

interface ZoneCreationAttr {
  restaurantId: string;
  name: string;
}

@Table({ tableName: 'zones', createdAt: false, updatedAt: false })
export class Zone extends Model<Zone, ZoneCreationAttr> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ForeignKey(() => Restaurant)
  @Column({ type: DataType.UUID, allowNull: false, field: 'restaurant_id' })
  restaurantId: string;

  @BelongsTo(() => Restaurant, { onDelete: 'CASCADE' })
  restaurant: Restaurant;

  @BelongsToMany(() => Waiter, () => ZoneWaiter)
  waiters: Waiter[];

  @BelongsToMany(() => RTable, () => ZoneTable)
  tables: RTable[];
}
