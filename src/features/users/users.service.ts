import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateOptions } from 'sequelize/types/model';

import { Restaurant } from '@features/restaurants/restaurants.model';
import { RTable } from '@features/restaurants/tables/tables.model';
import { Role } from '@features/roles/roles.model';
import { Device } from '@features/users/devices/devices.model';

import { Roles } from '@shared/constants';

import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private _userRepository: typeof User) {}

  public async checkEmailExists(email: string): Promise<boolean> {
    return await this._userRepository.findOne({ where: { email } }).then(user => !!user);
  }

  public createUser(dto: Partial<User>, options: CreateOptions = {}): Promise<User> {
    return this._userRepository.create(dto, options);
  }

  public getUser(id: string): Promise<User | null> {
    return this._userRepository.findOne({ where: { id } });
  }

  public getUserByCognitoId(cognitoId: string): Promise<User | null> {
    return this._userRepository.findOne({
      where: { cognitoId },
      attributes: { exclude: ['cognitoId', 'createdAt', 'updatedAt'] }
    });
  }

  public getUserByEmail(email: string): Promise<User | null> {
    return this._userRepository.findOne({
      where: { email },
      attributes: { exclude: ['cognitoId', 'createdAt', 'updatedAt'] }
    });
  }

  public async update(id: string, data: Partial<User>): Promise<User> {
    const [rowCount] = await this._userRepository.update(data, { where: { id } });

    if (rowCount === 0) {
      throw new NotFoundException('User not found');
    }

    return this.getUser(id);
  }

  public getRestaurantUsers(restaurantId: string, attributes: (keyof User)[]): Promise<User[]> {
    return this._userRepository.findAll({
      attributes: attributes,
      include: [
        {
          model: Role,
          through: { where: { restaurantId }, attributes: [] }
        }
      ],
      where: { '$roles.id$': { [Op.ne]: null } }
    });
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

  public getTableWaiters(tableId: string): Promise<User[]> {
    return this._userRepository.findAll({
      include: [
        {
          model: RTable,
          through: { where: { tableId } },
          attributes: []
        },
        {
          model: Device
        }
      ],
      where: { '$tables.id$': { [Op.ne]: null } }
    });
  }

  public getAllRestaurantWaiters(restaurantId: string): Promise<User[]> {
    return this._userRepository.findAll({
      include: [
        {
          model: Restaurant,
          through: { where: { restaurantId: restaurantId } }
        },
        {
          model: Device
        }
      ],
      where: { '$restaurants.id$': { [Op.ne]: null } }
    });
  }
}
