import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { RestaurantController } from './restaurant.controller';
import { Restaurant } from './restaurant.model';
import { RestaurantService } from './restaurant.service';

@Module({
  controllers: [RestaurantController],
  providers: [RestaurantService],
  imports: [SequelizeModule.forFeature([Restaurant])]
})
export class RestaurantModule {}
