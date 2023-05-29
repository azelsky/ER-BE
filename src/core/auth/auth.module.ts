import { Module } from '@nestjs/common';

import { RestaurantsModule } from '@features/restaurants';
import { RolesModule } from '@features/roles';
import { UsersModule } from '@features/users';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AwsCognitoModule } from '../aws-cognito/aws-cognito.module';

@Module({
  controllers: [AuthController],
  imports: [AwsCognitoModule, UsersModule, RolesModule, RestaurantsModule],
  providers: [AuthService]
})
export class AuthModule {}
