import { UUIDV4 } from 'sequelize';
import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Role } from '../role/role.model';
import { User } from '../user/user.model';

interface UserRoleCreationAttr {
  roleId: string;
  userId: string;
}

@Table({ tableName: 'user_role', createdAt: false, updatedAt: false })
export class UserRole extends Model<UserRole, UserRoleCreationAttr> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  })
  id: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID })
  roleId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string;
}
