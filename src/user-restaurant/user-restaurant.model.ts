import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Restaurant } from '../restaurant/restaurant.model';
import { User } from '../user/user.model';

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
}
