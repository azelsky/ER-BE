import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Restaurant } from './restaurant.model';

@Injectable()
export class RestaurantService {
  constructor(@InjectModel(Restaurant) private _restaurantRepository: typeof Restaurant) {}

  public create(restaurant: CreateRestaurantDto): Promise<Restaurant> {
    return this._restaurantRepository.create(restaurant);
  }

  public isSubdomainExists(subdomain: string): Promise<boolean> {
    return this._restaurantRepository
      .findOne({ where: { subdomain } })
      .then((restaurant: Restaurant) => !!restaurant);
  }
}
