import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { NotificationsModule } from '@features/notifications/notifications.module';
import { RolesModule } from '@features/roles/roles.module';
import { UsersModule } from '@features/users/users.module';

import { RestaurantPricingPlan } from '@relations/restaurant-pricing-plan/restaurant-pricing-plan.model';
import { UserRestaurant } from '@relations/user-restaurant/user-restaurant.model';
import { UserRole } from '@relations/user-role/user-role.model';
import { UserTableModule } from '@relations/user-table/user-table.module';

import { EmailModule } from '@shared/modules/email/email.module';

import { GuestsController } from './guests/guests.controller';
import { Guest } from './guests/guests.model';
import { GuestsService } from './guests/guests.service';
import { MonobankPaymentService } from './pricing-plans/monobank-payment.service';
import { PricingPlansController } from './pricing-plans/pricing-plans.controller';
import { PricingPlan } from './pricing-plans/pricing-plans.model';
import { PricingPlansService } from './pricing-plans/pricing-plans.service';
import { RestaurantsController } from './restaurants.controller';
import { Restaurant } from './restaurants.model';
import { RestaurantsService } from './restaurants.service';
import { TablesController } from './tables/tables.controller';
import { RTable } from './tables/tables.model';
import { TablesService } from './tables/tables.service';
import { TeamController } from './team/team.controller';
import { TeamService } from './team/team.service';
import { WaiterController } from './waiters/waiter.controller';
import { WaitersController } from './waiters/waiters.controller';
import { Waiter } from './waiters/waiters.model';
import { WaitersService } from './waiters/waiters.service';

@Module({
  controllers: [
    RestaurantsController,
    TeamController,
    GuestsController,
    TablesController,
    WaitersController,
    WaiterController,
    PricingPlansController
  ],
  providers: [
    RestaurantsService,
    TeamService,
    TablesService,
    GuestsService,
    WaitersService,
    PricingPlansService,
    MonobankPaymentService
  ],
  imports: [
    SequelizeModule.forFeature([
      Restaurant,
      UserRole,
      UserRestaurant,
      RTable,
      Guest,
      Waiter,
      PricingPlan,
      RestaurantPricingPlan
    ]),
    UsersModule,
    RolesModule,
    EmailModule,
    NotificationsModule,
    UserTableModule,
    HttpModule
  ],
  exports: [RestaurantsService]
})
export class RestaurantsModule {}
