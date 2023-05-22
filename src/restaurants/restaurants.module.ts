import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { RestaurantsController } from './restaurants-controller';
import { Restaurant } from './restaurants.model';
import { RestaurantsService } from './restaurants.service';
import { RolesModule } from '../roles/roles.module';
import { User } from '../users/users.model';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  imports: [SequelizeModule.forFeature([Restaurant, User]), UsersModule, RolesModule],
  exports: [RestaurantsService]
})
export class RestaurantsModule {}
