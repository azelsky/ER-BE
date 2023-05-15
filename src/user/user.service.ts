import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

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
