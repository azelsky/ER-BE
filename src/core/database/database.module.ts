import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Restaurant } from '@features/restaurants';
import { Role } from '@features/roles';
import { User } from '@features/users';
import { Device } from '@features/users/devices';

import { UserRestaurant } from '@relations/user-restaurant';
import { UserRole } from '@relations/user-role';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.USER,
      password: process.env.PASSWORD,
      database: 're',
      models: [User, Role, Restaurant, UserRole, UserRestaurant, Device],
      autoLoadModels: true
    })
  ],
  exports: [SequelizeModule]
})
export class DatabaseModule {}
