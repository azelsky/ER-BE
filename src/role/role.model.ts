import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';

import { User } from '../user/user.model';
import { UserRole } from '../user-role/user-role.model';

interface RoleCreationAttr {
  value: string;
  description: string;
}

@Table({ tableName: 'role' })
export class Role extends Model<Role, RoleCreationAttr> {
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  value: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @BelongsToMany(() => User, () => UserRole)
  users: User[];
}
