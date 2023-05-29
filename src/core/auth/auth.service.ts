import { ConflictException, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

import { RestaurantsService } from '@features/restaurants';
import { RolesService } from '@features/roles';
import { UsersService } from '@features/users';

import { Roles } from '@shared/constants';

import { AuthRegisterDto } from './dto';
import { AwsCognitoService } from '../aws-cognito/services/aws-cognito.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _sequelize: Sequelize,
    private readonly _rolesService: RolesService,
    private readonly _restaurantsService: RestaurantsService,
    private readonly _awsCognitoService: AwsCognitoService,
    private readonly _usersService: UsersService
  ) {}

  public async completeRegistration(email: string, name: string, password: string): Promise<void> {
    const user = await this._usersService.getUserByEmail(email);

    if (user.cognitoId) {
      throw new ConflictException('User id already confirmed');
    }

    const cognitoUserId = await this._awsCognitoService.registerUser(email, name, password);

    await this._usersService.update(user.id, { name, cognitoId: cognitoUserId });
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
      const { name, email, password } = authRegisterDto;
      const cognitoUserId = await this._awsCognitoService.registerUser(email, name, password);

      const user = await this._usersService.createUser(
        {
          cognitoId: cognitoUserId,
          name,
          email
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
