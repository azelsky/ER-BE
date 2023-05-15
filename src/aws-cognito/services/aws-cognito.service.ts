import { ConflictException, Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool
} from 'amazon-cognito-identity-js';

import { AuthLoginUserDto } from '../../auth/dto/auth-login-user.dto';
import { AuthRegisterDto } from '../../auth/dto/auth-register.dto';
import { AuthResponse } from '../../auth/interfaces/auth-response.interface';

@Injectable()
export class AwsCognitoService {
  private readonly _userPool: CognitoUserPool = new CognitoUserPool({
    UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    ClientId: process.env.AWS_COGNITO_CLIENT_ID
  });

  public async registerUser(authRegisterUserDto: AuthRegisterDto): Promise<string> {
    const { name, email, password } = authRegisterUserDto;

    return new Promise<string>((resolve, reject) => {
      this._userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({
            Name: 'name',
            Value: name
          })
        ],
        null,
        (err, result) => {
          if (!result) {
            reject(new ConflictException(err.message));
          } else {
            resolve(result.userSub);
          }
        }
      );
    });
  }

  public async authenticateUser(authLoginUserDto: AuthLoginUserDto): Promise<AuthResponse> {
    const { email, password } = authLoginUserDto;
    const userData = {
      Username: email,
      Pool: this._userPool
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: result => {
          resolve({
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken()
          });
        },
        onFailure: err => {
          reject(err);
        }
      });
    });
  }
}
