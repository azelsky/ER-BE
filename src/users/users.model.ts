import { UUIDV4 } from 'sequelize';
import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';

import { Restaurant } from '../restaurants/restaurants.model';
import { Role } from '../roles/roles.model';
import { UserRestaurant } from '../user-restaurant/user-restaurant.model';
import { UserRole } from '../user-role/user-role.model';

interface UserCreationAttr {
  name: string;
  email: string;
  cognitoId: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttr> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  cognitoId: string;

  @BelongsToMany(() => Role, () => UserRole)
  roles: Role[];

  @BelongsToMany(() => Restaurant, () => UserRestaurant)
  restaurants: Restaurant[];
}
