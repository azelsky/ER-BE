import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';

import { Roles } from '@shared/constants';

import { Restaurant } from '../restaurant/restaurants.model';
import { User } from '../user/users.model';
import { UserRole } from '../user-role/user-role.model';

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
