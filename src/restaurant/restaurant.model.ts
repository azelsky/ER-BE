import { UUIDV4 } from 'sequelize';
import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';

import { User } from '../user/user.model';
import { UserRestaurant } from '../user-restaurant/user-restaurant.model';

interface RestaurantCreationAttr {
  name: string;
  subdomain: string;
}

@Table({ tableName: 'restaurants' })
export class Restaurant extends Model<Restaurant, RestaurantCreationAttr> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  subdomain: string;

  @BelongsToMany(() => User, () => UserRestaurant)
  users: User[];
}