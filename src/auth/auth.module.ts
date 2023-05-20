import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AwsCognitoModule } from '../aws-cognito/aws-cognito.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AuthController],
  imports: [AwsCognitoModule, UsersModule, RolesModule, RestaurantsModule],
  providers: [AuthService]
})
export class AuthModule {}
