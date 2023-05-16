import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';
import { AwsCognitoModule } from '../aws-cognito/aws-cognito.module';
import { Restaurant } from '../restaurants/restaurants.model';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { Role } from '../roles/roles.model';
import { RolesModule } from '../roles/roles.module';
import { UserRole } from '../user-role/user-role.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRole, Restaurant]),
    RolesModule,
    RestaurantsModule,
    AwsCognitoModule
  ],
  exports: [UsersService]
})
export class UsersModule {}
