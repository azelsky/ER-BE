import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Restaurant } from '@features/restaurants/restaurants.model';
import { User } from '@features/users/users.model';

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
  @Column({ type: DataType.UUID, field: 'restaurant_id' })
  restaurantId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'user_id' })
  userId: string;

  @BelongsTo(() => User, { foreignKey: 'user_id', onDelete: 'CASCADE' })
  user: User;

  @BelongsTo(() => Restaurant, { foreignKey: 'restaurant_id', onDelete: 'CASCADE' })
  restaurant: Restaurant;
}
