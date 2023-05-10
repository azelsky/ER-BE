import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Restaurant } from './restaurant/restaurant.model';
import { RestaurantModule } from './restaurant/restaurant.module';
import { Role } from './role/role.model';
import { RoleModule } from './role/role.module';
import { User } from './user/user.model';
import { UserModule } from './user/user.module';
import { UserRestaurant } from './user-restaurant/user-restaurant.model';
import { UserRestaurantModule } from './user-restaurant/user-restaurant.module';
import { UserRole } from './user-role/user-role.model';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    UserModule,
    RoleModule,
    RestaurantModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.USER,
      password: process.env.PASSWORD,
      database: 're',
      models: [User, Role, Restaurant, UserRole, UserRestaurant],
      autoLoadModels: true
    }),
    UserRestaurantModule
  ]
})
export class AppModule {}
