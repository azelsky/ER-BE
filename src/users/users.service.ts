import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

import { AuthRegisterDto } from '@auth/dto';

import { Roles } from '@shared/constants';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { AwsCognitoService } from '../aws-cognito/services/aws-cognito.service';
import { Restaurant } from '../restaurants/restaurants.model';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private _userRepository: typeof User,
    @InjectModel(Restaurant) private _restaurantRepository: typeof Restaurant,
    private readonly _sequelize: Sequelize,
    private readonly _rolesService: RolesService,
    private readonly _restaurantsService: RestaurantsService,
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
      const ownerRole = await this._rolesService.getRoleByValue(Roles.Owner);

      const restaurant = await this._restaurantsService.create(
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
    return this._userRepository.findOne({
      where: { cognitoId },
      attributes: { exclude: ['cognitoId', 'createdAt', 'updatedAt'] }
    });
  }
}
