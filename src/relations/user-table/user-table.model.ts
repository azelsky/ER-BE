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
  // toDo add id uuid
  @ForeignKey(() => RTable)
  @Column({ type: DataType.UUID, field: 'table_id' })
  tableId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'user_id' })
  userId: string;

  @BelongsTo(() => User, { foreignKey: 'user_id', onDelete: 'CASCADE' })
  user: User;

  @BelongsTo(() => RTable, { foreignKey: 'table_id', onDelete: 'CASCADE' })
  table: RTable;
}
