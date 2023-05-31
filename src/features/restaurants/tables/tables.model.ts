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

import { User } from '@features/users/users.model';

import { UserTable } from '@relations/user-table/user-table.model';

import { Restaurant } from '../restaurants.model';

interface TableAttr {
  name: string;
  restaurantId: string;
}

@Table({ tableName: 'tables' })
export class RTable extends Model<RTable, TableAttr> implements TableAttr {
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

  @BelongsToMany(() => User, () => UserTable)
  users: User[];
}
