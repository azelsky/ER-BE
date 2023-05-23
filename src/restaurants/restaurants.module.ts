import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { RestaurantsController } from './controllers/restaurants-controller';
import { TeamController } from './controllers/team-controller';
import { Restaurant } from './restaurants.model';
import { RestaurantsService } from './services/restaurants.service';
import { TeamService } from './services/team.service';
import { RolesModule } from '../roles/roles.module';
import { User } from '../users/users.model';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [RestaurantsController, TeamController],
  providers: [RestaurantsService, TeamService],
  imports: [SequelizeModule.forFeature([Restaurant, User]), UsersModule, RolesModule],
  exports: [RestaurantsService]
})
export class RestaurantsModule {}
