import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { NotificationsModule } from '@features/notifications';
import { RolesModule } from '@features/roles/roles.module';
import { UsersModule } from '@features/users/users.module';

import { UserRestaurant } from '@relations/user-restaurant/user-restaurant.model';
import { UserRole } from '@relations/user-role/user-role.model';
import { UserTableModule } from '@relations/user-table/user-table.module';

import { EmailModule } from '@shared/modules/email/email.module';

import { GuestsController } from './guests/guests.controller';
import { Guest } from './guests/guests.model';
import { GuestsService } from './guests/guests.service';
import { RestaurantsController } from './restaurants.controller';
import { Restaurant } from './restaurants.model';
import { RestaurantsService } from './restaurants.service';
import { TablesController } from './tables/tables.controller';
import { RTable } from './tables/tables.model';
import { TablesService } from './tables/tables.service';
import { TeamController } from './team/team.controller';
import { TeamService } from './team/team.service';

@Module({
  controllers: [RestaurantsController, TeamController, GuestsController, TablesController],
  providers: [RestaurantsService, TeamService, TablesService, GuestsService],
  imports: [
    SequelizeModule.forFeature([Restaurant, UserRole, UserRestaurant, RTable, Guest]),
    UsersModule,
    RolesModule,
    EmailModule,
    NotificationsModule,
    UserTableModule
  ],
  exports: [RestaurantsService]
})
export class RestaurantsModule {}
