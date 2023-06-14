import { UUIDV4 } from 'sequelize';
import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';

import { Restaurant } from '@features/restaurants/restaurants.model';
import { User } from '@features/users/users.model';

import { UserRole } from '@relations/user-role/user-role.model';

import { Roles } from '@shared/constants';

interface RoleCreationAttr {
  value: string;
  description: string;
}

@Table({ tableName: 'roles', createdAt: false, updatedAt: false })
export class Role extends Model<Role, RoleCreationAttr> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  })
  id: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  value: Roles;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @BelongsToMany(() => User, () => UserRole)
  users: User[];

  @BelongsToMany(() => Restaurant, () => UserRole)
  restaurants: Restaurant[];
}
