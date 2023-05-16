import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

import { AuthRegisterDto } from '@auth/dto';

import { Roles } from '@shared/constants';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { AwsCognitoService } from '../aws-cognito/services/aws-cognito.service';
import { Restaurant } from '../restaurant/restaurant.model';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Role } from '../role/role.model';
import { RoleService } from '../role/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private _userRepository: typeof User,
    @InjectModel(Restaurant) private _restaurantRepository: typeof Restaurant,
    private readonly _sequelize: Sequelize,
    private readonly _roleService: RoleService,
    private readonly _restaurantService: RestaurantService,
    private readonly _awsCognitoService: AwsCognitoService
  ) {}

  public async checkEmailExists(email: string): Promise<boolean> {
    return await this._userRepository.findOne({ where: { email } }).then(user => !!user);
  }

  public createUser(dto: CreateUserDto): Promise<User> {
    return this._userRepository.create(dto);
  }

  public async createUserWithRestaurant(authRegisterDto: AuthRegisterDto): Promise<void> {
    const transaction = await this._sequelize.transaction();

    try {
      const ownerRole = await this._roleService.getRoleByValue(Roles.Owner);

      const restaurant = await this._restaurantService.create(
        {
          name: authRegisterDto.restaurantName,
          subdomain: authRegisterDto.subdomain
        },
        { transaction }
      );

      const cognitoUserId = await this._awsCognitoService.registerUser(authRegisterDto);

      const user = await this._userRepository.create(
        {
          cognitoId: cognitoUserId,
          name: authRegisterDto.name,
          email: authRegisterDto.email
        },
        { transaction }
      );

      await user.$add('restaurants', restaurant, { transaction });
      await user.$add('role', ownerRole.id, {
        through: { restaurantId: restaurant.id },
        transaction
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public getUser(id: string): Promise<User | null> {
    return this._userRepository.findOne({ where: { id } });
  }

  public getUserByCognitoId(cognitoId: string): Promise<User | null> {
    return this._userRepository.findOne({ where: { cognitoId } });
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
