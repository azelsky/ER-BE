import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { RolesModule } from '@features/roles';
import { User } from '@features/users';
import { UsersModule } from '@features/users';

import { UserRestaurant } from '@relations/user-restaurant';
import { UserRole } from '@relations/user-role';

import { EmailModule } from '@shared/modules/email/email.module';

import { RestaurantsController } from './restaurants.controller';
import { Restaurant } from './restaurants.model';
import { RestaurantsService } from './restaurants.service';
import { TeamController, TeamService } from './team';

@Module({
  controllers: [RestaurantsController, TeamController],
  providers: [RestaurantsService, TeamService],
  imports: [
    SequelizeModule.forFeature([Restaurant, User, UserRole, UserRestaurant]),
    UsersModule,
    RolesModule,
    EmailModule
  ],
  exports: [RestaurantsService]
})
export class RestaurantsModule {}
