import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Restaurant } from '@features/restaurants';
import { User } from '@features/users';

interface UserRestaurantCreationAttr {
  restaurantId: string;
  userId: string;
}

@Table({ tableName: 'user_restaurant', createdAt: false, updatedAt: false })
export class UserRestaurant
  extends Model<UserRestaurant, UserRestaurantCreationAttr>
  implements UserRestaurantCreationAttr
{
  @ForeignKey(() => Restaurant)
  @Column({ type: DataType.UUID })
  restaurantId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string;

  @BelongsTo(() => User, { foreignKey: 'userId', onDelete: 'CASCADE' })
  user: User;

  @BelongsTo(() => Restaurant, { foreignKey: 'restaurantId', onDelete: 'CASCADE' })
  restaurant: Restaurant;
}
