import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Guest } from '@features/restaurants/guests/guests.model';
import { Restaurant } from '@features/restaurants/restaurants.model';
import { RTable } from '@features/restaurants/tables/tables.model';
import { Role } from '@features/roles/roles.model';
import { Device } from '@features/users/devices/devices.model';
import { User } from '@features/users/users.model';

import { UserRestaurant } from '@relations/user-restaurant/user-restaurant.model';
import { UserRole } from '@relations/user-role/user-role.model';
import { UserTable } from '@relations/user-table/user-table.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      port: +process.env.DB_HOST_PORT,
      uri: process.env.DB_URI,
      models: [User, Role, Restaurant, UserRole, UserRestaurant, Device, UserTable, Guest, RTable],
      autoLoadModels: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // Change this to true in production
        }
      }
    })
  ],
  exports: [SequelizeModule]
})
export class DatabaseModule {}
