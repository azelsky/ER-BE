import { UUIDV4 } from 'sequelize';
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Restaurant } from '../restaurants/restaurants.model';
import { Role } from '../roles/roles.model';
import { User } from '../users/users.model';

interface UserRoleCreationAttr {
  roleId: string;
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
  @Column({ type: DataType.UUID })
  roleId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string;

  @ForeignKey(() => Restaurant)
  @Column({ type: DataType.UUID })
  restaurantId: string;

  @BelongsTo(() => Restaurant, { foreignKey: 'restaurantId', onDelete: 'CASCADE' })
  restaurant: Restaurant;

  @BelongsTo(() => User, { foreignKey: 'userId', onDelete: 'CASCADE' })
  user: User;

  @BelongsTo(() => Role, { foreignKey: 'roleId', onDelete: 'CASCADE' })
  role: Role;
}
