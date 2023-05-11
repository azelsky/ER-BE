import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AwsCognitoService } from './aws-cognito.service';
import { JwtStrategy } from './jwt.strategy';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AwsCognitoService, JwtStrategy],
  imports: [UserModule, RestaurantModule, PassportModule.register({ defaultStrategy: 'jwt' })]
})
export class AuthModule {}
