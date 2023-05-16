import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';
import { AwsCognitoModule } from '../aws-cognito/aws-cognito.module';
import { Restaurant } from '../restaurant/restaurants.model';
import { RestaurantsModule } from '../restaurant/restaurants.module';
import { Role } from '../role/role.model';
import { RoleModule } from '../role/role.module';
import { UserRole } from '../user-role/user-role.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRole, Restaurant]),
    RoleModule,
    RestaurantsModule,
    AwsCognitoModule
  ],
  exports: [UsersService]
})
export class UsersModule {}
