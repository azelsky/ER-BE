import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserController } from './user.controller';
import { User } from './user.model';
import { UserService } from './user.service';
import { AwsCognitoModule } from '../aws-cognito/aws-cognito.module';
import { Restaurant } from '../restaurant/restaurant.model';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { Role } from '../role/role.model';
import { RoleModule } from '../role/role.module';
import { UserRole } from '../user-role/user-role.model';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRole, Restaurant]),
    RoleModule,
    RestaurantModule,
    AwsCognitoModule
  ],
  exports: [UserService]
})
export class UserModule {}
