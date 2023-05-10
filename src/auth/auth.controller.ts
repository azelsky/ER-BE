import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CognitoUser } from 'amazon-cognito-identity-js';

import { AwsCognitoService } from './aws-cognito.service';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { AuthRegisterUserDto } from './dto/auth-register-user.dto';
import { AuthResponse } from './interfaces/auth-response.interface';

@Controller('auth')
export class AuthController {
  constructor(private awsCognitoService: AwsCognitoService) {}

  @UsePipes(ValidationPipe)
  @Post('/register')
  public async register(@Body() authRegisterUserDto: AuthRegisterUserDto): Promise<CognitoUser> {
    return await this.awsCognitoService.registerUser(authRegisterUserDto);
  }

  @UsePipes(ValidationPipe)
  @Post('/login')
  @UsePipes(ValidationPipe)
  public async login(@Body() authLoginUserDto: AuthLoginUserDto): Promise<AuthResponse> {
    return await this.awsCognitoService.authenticateUser(authLoginUserDto);
  }
}
