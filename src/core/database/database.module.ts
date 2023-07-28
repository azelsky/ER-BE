import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { GuestPage } from '@features/restaurants/guest-pages/guest-pages.model';
import { Guest } from '@features/restaurants/guests/guests.model';
import { PricingPlan } from '@features/restaurants/pricing-plans/pricing-plans.model';
import { Restaurant } from '@features/restaurants/restaurants.model';
import { RTable } from '@features/restaurants/tables/tables.model';
import { Waiter } from '@features/restaurants/waiters/waiters.model';
import { ZoneTable } from '@features/restaurants/zones/zone-table.model';
import { ZoneWaiter } from '@features/restaurants/zones/zone-waiter.model';
import { Zone } from '@features/restaurants/zones/zones.model';
import { Role } from '@features/roles/roles.model';
import { Device } from '@features/users/devices/devices.model';
import { User } from '@features/users/users.model';

import { RestaurantPricingPlan } from '@relations/restaurant-pricing-plan/restaurant-pricing-plan.model';
import { UserRestaurant } from '@relations/user-restaurant/user-restaurant.model';
import { UserRole } from '@relations/user-role/user-role.model';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const dbConfig = {
          dialect: configService.get('DB_DIALECT'),
          host: configService.get('DB_HOST_NAME'),
          port: +configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          models: [
            User,
            Role,
            Restaurant,
            UserRole,
            UserRestaurant,
            PricingPlan,
            RestaurantPricingPlan,
            Device,
            Guest,
            RTable,
            Waiter,
            Zone,
            ZoneWaiter,
            ZoneTable,
            GuestPage
          ],
          autoLoadModels: true,
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
          }
        };

        if (process.env.LOCAL) {
          delete dbConfig.dialectOptions;
        }

        return dbConfig;
      },
      inject: [ConfigService]
    })
  ],
  exports: [SequelizeModule]
})
export class DatabaseModule {}
