import { UUIDV4 } from 'sequelize';
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

import { Restaurant } from '@features/restaurants';
import { Role } from '@features/roles';

import { UserRestaurant } from '@relations/user-restaurant';
import { UserRole } from '@relations/user-role';

import { Device } from './devices';

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

  @HasMany(() => Device)
  devices: Device[];
}
