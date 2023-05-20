import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SkipAuthGuard } from './decorators';
import { AuthRegisterDto, RegisterResponseDto, AuthLoginUserDto } from './dto';
import { AuthResponse } from './interfaces/auth-response.interface';
import { AwsCognitoService } from '../aws-cognito/services/aws-cognito.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _awsCognitoService: AwsCognitoService,
    private readonly _authService: AuthService
  ) {}

  @SkipAuthGuard()
  @Post('/register')
  public async register(@Body() authRegisterDto: AuthRegisterDto): Promise<RegisterResponseDto> {
    await this._authService.createUserWithRestaurant(authRegisterDto);
    return { success: true };
  }

  @SkipAuthGuard()
  @Post('/login')
  public async login(@Body() authLoginUserDto: AuthLoginUserDto): Promise<AuthResponse> {
    return await this._awsCognitoService.authenticateUser(authLoginUserDto);
  }
}
