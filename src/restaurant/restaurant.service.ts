import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Restaurant } from './restaurant.model';

@Injectable()
export class RestaurantService {
  constructor(@InjectModel(Restaurant) private _restaurantRepository: typeof Restaurant) {}

  public isSubdomainExists(subDomainName: string): Promise<boolean> {
    return this._restaurantRepository
      .findOne({ where: { subDomainName } })
      .then((restaurant: Restaurant) => !!restaurant);
  }
}
