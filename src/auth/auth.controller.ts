import { Body, Controller, Post } from '@nestjs/common';

import { SkipAuthGuard } from './decorators';
import { AuthRegisterDto, RegisterResponseDto, AuthLoginUserDto } from './dto';
import { AuthResponse } from './interfaces/auth-response.interface';
import { AwsCognitoService } from '../aws-cognito/services/aws-cognito.service';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _awsCognitoService: AwsCognitoService,
    private readonly _userService: UserService
  ) {}

  @SkipAuthGuard()
  @Post('/register')
  public async register(@Body() authRegisterDto: AuthRegisterDto): Promise<RegisterResponseDto> {
    await this._userService.createUserWithRestaurant(authRegisterDto);
    return { success: true };
  }

  @SkipAuthGuard()
  @Post('/login')
  public async login(@Body() authLoginUserDto: AuthLoginUserDto): Promise<AuthResponse> {
    return await this._awsCognitoService.authenticateUser(authLoginUserDto);
  }
}
