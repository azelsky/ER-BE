import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';

import { Roles } from '@shared/constants';

import { Restaurant } from '../restaurants/restaurants.model';
import { UserRole } from '../user-role/user-role.model';
import { User } from '../users/users.model';

interface RoleCreationAttr {
  value: string;
  description: string;
}

@Table({ tableName: 'roles', createdAt: false, updatedAt: false })
export class Role extends Model<Role, RoleCreationAttr> {
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  value: Roles;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @BelongsToMany(() => User, () => UserRole)
  users: User[];

  @BelongsToMany(() => Restaurant, () => UserRole)
  restaurants: Restaurant[];
}
