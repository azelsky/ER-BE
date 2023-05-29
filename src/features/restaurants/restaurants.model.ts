import { UUIDV4 } from 'sequelize';
import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';

import { Role } from '@features/roles';
import { User } from '@features/users';

import { UserRestaurant } from '@relations/user-restaurant';
import { UserRole } from '@relations/user-role';

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
}
