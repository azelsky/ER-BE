import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { RestaurantsController } from './restaurants-controller';
import { Restaurant } from './restaurants.model';
import { RestaurantsService } from './restaurants.service';

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  imports: [SequelizeModule.forFeature([Restaurant])],
  exports: [RestaurantsService]
})
export class RestaurantsModule {}
