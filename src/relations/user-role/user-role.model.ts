import { UUIDV4 } from 'sequelize';
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Restaurant } from '@features/restaurants/restaurants.model';
import { Role } from '@features/roles/roles.model';
import { User } from '@features/users/users.model';

interface UserRoleCreationAttr {
  roleId: number;
  userId: string;
  restaurantId: string;
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
  @Column({ type: DataType.UUID, field: 'role_id' })
  roleId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'user_id' })
  userId: string;

  @ForeignKey(() => Restaurant)
  @Column({ type: DataType.UUID, field: 'restaurant_id' })
  restaurantId: string;

  @BelongsTo(() => Restaurant, { foreignKey: 'restaurant_id', onDelete: 'CASCADE' })
  restaurant: Restaurant;

  @BelongsTo(() => User, { foreignKey: 'user_id', onDelete: 'CASCADE' })
  user: User;

  @BelongsTo(() => Role, { foreignKey: 'role_id', onDelete: 'CASCADE' })
  role: Role;
}
