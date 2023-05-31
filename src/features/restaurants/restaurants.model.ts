import { UUIDV4 } from 'sequelize';
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

import { Role } from '@features/roles/roles.model';
import { User } from '@features/users/users.model';

import { UserRestaurant } from '@relations/user-restaurant/user-restaurant.model';
import { UserRole } from '@relations/user-role/user-role.model';

import { RTable } from './tables/tables.model';

interface RestaurantCreationAttr {
  name: string;
  subdomain: string;
}

@Table({ tableName: 'restaurants' })
export class Restaurant extends Model<Restaurant, RestaurantCreationAttr> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  subdomain: string;

  @BelongsToMany(() => User, () => UserRestaurant)
  users: User[];

  @BelongsToMany(() => Role, () => UserRole)
  roles: Role[];

  @HasMany(() => RTable)
  tables: RTable[];
}
