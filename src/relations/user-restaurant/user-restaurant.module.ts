import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserRestaurant } from './user-restaurant.model';

@Module({
  imports: [SequelizeModule.forFeature([UserRestaurant])]
})
export class UserRestaurantModule {}
