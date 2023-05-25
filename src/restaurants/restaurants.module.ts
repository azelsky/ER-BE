import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { RestaurantsController } from './controllers/restaurants-controller';
import { TeamController } from './controllers/team-controller';
import { Restaurant } from './restaurants.model';
import { RestaurantsService } from './services/restaurants.service';
import { TeamService } from './services/team.service';
import { RolesModule } from '../roles/roles.module';
import { UserRestaurant } from '../user-restaurant/user-restaurant.model';
import { UserRole } from '../user-role/user-role.model';
import { User } from '../users/users.model';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [RestaurantsController, TeamController],
  providers: [RestaurantsService, TeamService],
  imports: [
    SequelizeModule.forFeature([Restaurant, User, UserRole, UserRestaurant]),
    UsersModule,
    RolesModule
  ],
  exports: [RestaurantsService]
})
export class RestaurantsModule {}
