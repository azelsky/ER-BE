import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

import { AuthRegisterDto } from '@auth/dto';

import { Roles } from '@shared/constants';

import { AwsCognitoService } from '../aws-cognito/services/aws-cognito.service';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _sequelize: Sequelize,
    private readonly _rolesService: RolesService,
    private readonly _restaurantsService: RestaurantsService,
    private readonly _awsCognitoService: AwsCognitoService,
    private readonly _usersService: UsersService
  ) {}

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

      const user = await this._usersService.createUser(
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
}
