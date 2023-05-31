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
      host: 'localhost',
      port: 5432,
      username: process.env.USER,
      password: process.env.PASSWORD,
      database: 're',
      models: [User, Role, Restaurant, UserRole, UserRestaurant, Device, UserTable, Guest, RTable],
      autoLoadModels: true
    })
  ],
  exports: [SequelizeModule]
})
export class DatabaseModule {}
