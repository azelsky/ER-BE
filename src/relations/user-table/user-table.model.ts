import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { RTable } from '@features/restaurants/tables/tables.model';
import { User } from '@features/users/users.model';

interface UserTableCreationAttr {
  tableId: string;
  userId: string;
}

@Table({ tableName: 'user_table', createdAt: false, updatedAt: false })
export class UserTable
  extends Model<UserTable, UserTableCreationAttr>
  implements UserTableCreationAttr
{
  @ForeignKey(() => RTable)
  @Column({ type: DataType.UUID })
  tableId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string;

  @BelongsTo(() => User, { foreignKey: 'userId', onDelete: 'CASCADE' })
  user: User;

  @BelongsTo(() => RTable, { foreignKey: 'tableId', onDelete: 'CASCADE' })
  table: RTable;
}
