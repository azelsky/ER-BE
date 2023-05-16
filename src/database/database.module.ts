import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Restaurant } from '../restaurant/restaurants.model';
import { Role } from '../role/role.model';
import { User } from '../user/users.model';
import { UserRestaurant } from '../user-restaurant/user-restaurant.model';
import { UserRole } from '../user-role/user-role.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.USER,
      password: process.env.PASSWORD,
      database: 're',
      models: [User, Role, Restaurant, UserRole, UserRestaurant],
      autoLoadModels: true
    })
  ],
  exports: [SequelizeModule]
})
export class DatabaseModule {}
