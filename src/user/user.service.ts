import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { Role } from '../role/role.model';
import { Roles } from '../shared/constants';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private _userRepository: typeof User) {}

  public async checkEmailExists(email: string): Promise<boolean> {
    return await this._userRepository.findOne({ where: { email } }).then(user => !!user);
  }

  public createUser(dto: CreateUserDto): Promise<User> {
    return this._userRepository.create(dto);
  }

  public async createUserInTransaction(data: any, transaction: Transaction): Promise<User> {
    return this._userRepository.create(data, { transaction });
  }

  public async addRestaurantToUserInTransaction(
    userId: string,
    restaurantId: string,
    transaction: Transaction
  ): Promise<void> {
    const user = await this._userRepository.findByPk(userId, { transaction });
    if (!user) {
      throw new Error('User not found');
    }

    await user.$add('restaurants', restaurantId, { transaction });
  }

  public async addRoleToUserInTransaction(
    userId: string,
    roleId: string,
    restaurantId: string,
    transaction: Transaction
  ): Promise<void> {
    const user = await this._userRepository.findByPk(userId, { transaction });
    if (!user) {
      throw new Error('User not found');
    }

    await user.$add('role', roleId, { through: { restaurantId }, transaction });
  }

  public getUser(id: string): Promise<User | null> {
    return this._userRepository.findOne({ where: { id } });
  }

  public getUserRolesForRestaurant(cognitoId: string, restaurantId: string): Promise<Array<Roles>> {
    return this._userRepository
      .findOne({
        where: { cognitoId },
        include: [
          {
            model: Role,
            attributes: ['value'],
            through: { attributes: [], where: { restaurantId } }
          }
        ]
      })
      .then(user => {
        if (!user) {
          return [];
        } else {
          return user.roles.map(role => role.value);
        }
      });
  }
}
