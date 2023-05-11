import { Body, Controller, Post } from '@nestjs/common';

import { AwsCognitoService } from './aws-cognito.service';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthResponse } from './interfaces/auth-response.interface';
import { SkipAuthGuard } from '../core/decorators/skip-auth.decorator';
import { RestaurantService } from '../restaurant/restaurant.service';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly awsCognitoService: AwsCognitoService,
    private readonly _userService: UserService,
    private readonly _restaurantService: RestaurantService
  ) {}

  @SkipAuthGuard()
  @Post('/register')
  public async register(@Body() authRegisterDto: AuthRegisterDto): Promise<boolean> {
    const cognitoUserId = await this.awsCognitoService.registerUser(authRegisterDto);

    const user = await this._userService.createUser({
      cognitoId: cognitoUserId,
      name: authRegisterDto.name,
      email: authRegisterDto.email
    });

    const restaurant = await this._restaurantService.create({
      name: authRegisterDto.restaurantName,
      subdomain: authRegisterDto.subdomain
    });

    await user.$set('restaurants', [restaurant]);

    return true;
  }

  @SkipAuthGuard()
  @Post('/login')
  public async login(@Body() authLoginUserDto: AuthLoginUserDto): Promise<AuthResponse> {
    return await this.awsCognitoService.authenticateUser(authLoginUserDto);
  }
}
