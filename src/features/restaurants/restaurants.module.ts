import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { RTable } from '@features/restaurants/tables';
import { RolesModule } from '@features/roles';
import { UsersModule } from '@features/users';

import { UserRestaurant } from '@relations/user-restaurant';
import { UserRole } from '@relations/user-role';
import { UserTableModule } from '@relations/user-table';

import { EmailModule } from '@shared/modules/email/email.module';
import { NotificationsModule } from '@shared/modules/notifications';

import { Guest, GuestsController } from './guests';
import { RestaurantsController } from './restaurants.controller';
import { Restaurant } from './restaurants.model';
import { RestaurantsService } from './restaurants.service';
import { TeamController, TeamService } from './team';

@Module({
  controllers: [RestaurantsController, TeamController, GuestsController],
  providers: [RestaurantsService, TeamService],
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
