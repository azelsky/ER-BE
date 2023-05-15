import { Body, Controller, Post } from '@nestjs/common';
import { Sequelize } from 'sequelize';

import { AwsCognitoService } from './aws-cognito.service';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { AuthResponse } from './interfaces/auth-response.interface';
import { SkipAuthGuard } from '../core/decorators/skip-auth.decorator';
import { RestaurantService } from '../restaurant/restaurant.service';
import { RoleService } from '../role/role.service';
import { Roles } from '../shared/constants';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly awsCognitoService: AwsCognitoService,
    private readonly _userService: UserService,
    private readonly _roleService: RoleService,
    private readonly _restaurantService: RestaurantService,
    private readonly sequelize: Sequelize
  ) {}

  @SkipAuthGuard()
  @Post('/register')
  public async register(@Body() authRegisterDto: AuthRegisterDto): Promise<RegisterResponseDto> {
    const transaction = await this.sequelize.transaction();

    try {
      const ownerRole = await this._roleService.getRoleByValue(Roles.Owner);

      const cognitoUserId = await this.awsCognitoService.registerUser(authRegisterDto);

      const user = await this._userService.createUserInTransaction(
        {
          cognitoId: cognitoUserId,
          name: authRegisterDto.name,
          email: authRegisterDto.email
        },
        transaction
      );

      const restaurant = await this._restaurantService.createInTransaction(
        {
          name: authRegisterDto.restaurantName,
          subdomain: authRegisterDto.subdomain
        },
        transaction
      );

      await this._userService.addRestaurantToUserInTransaction(user.id, restaurant.id, transaction);
      await this._userService.addRoleToUserInTransaction(
        user.id,
        ownerRole.id,
        restaurant.id,
        transaction
      );

      await transaction.commit();

      return { success: true };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  @SkipAuthGuard()
  @Post('/login')
  public async login(@Body() authLoginUserDto: AuthLoginUserDto): Promise<AuthResponse> {
    return await this.awsCognitoService.authenticateUser(authLoginUserDto);
  }
}
