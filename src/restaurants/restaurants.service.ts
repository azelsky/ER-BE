import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateOptions } from 'sequelize/types/model';

import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { TRestaurantDetails } from './interfaces/reataurant-details.type';
import { IRelatedRestaurant } from './interfaces/related-restaurant.interface';
import {
  RELATED_RESTAURANT_FIELDS,
  RELATED_RESTAURANT_ROLE_FIELDS,
  RESTAURANT_DETAILS_FIELDS
} from './restaurants.constants';
import { Restaurant } from './restaurants.model';
import { Role } from '../roles/roles.model';
import { User } from '../users/users.model';

@Injectable()
export class RestaurantsService {
  constructor(@InjectModel(Restaurant) private _restaurantRepository: typeof Restaurant) {}

  public async create(
    restaurant: CreateRestaurantDto,
    options: CreateOptions = {}
  ): Promise<Restaurant> {
    const subdomainExists = await this.isSubdomainExists(restaurant.subdomain);
    if (subdomainExists) {
      throw new ConflictException('Subdomain already exists');
    }

    return this._restaurantRepository.create(restaurant, options);
  }

  public isSubdomainExists(subdomain: string): Promise<boolean> {
    return this._restaurantRepository
      .findOne({ where: { subdomain } })
      .then((restaurant: Restaurant) => !!restaurant);
  }

  public async getRelatedRestaurants(cognitoId: string): Promise<IRelatedRestaurant[]> {
    return this._restaurantRepository.findAll<Restaurant>({
      include: [
        {
          model: User,
          where: { cognitoId },
          attributes: []
        },
        {
          model: Role,
          through: { attributes: [] },
          attributes: [...RELATED_RESTAURANT_ROLE_FIELDS]
        }
      ],
      attributes: [...RELATED_RESTAURANT_FIELDS]
    });
  }

  public getRestaurantDetails(id: string): Promise<TRestaurantDetails> {
    return this._restaurantRepository.findOne({
      attributes: [...RESTAURANT_DETAILS_FIELDS],
      where: { id }
    });
  }

  public async updateRestaurantDetails(
    id: string,
    data: Partial<TRestaurantDetails>
  ): Promise<TRestaurantDetails> {
    const [rowCount] = await this._restaurantRepository.update(data, {
      where: { id }
    });

    if (rowCount === 0) {
      throw new NotFoundException('Restaurant not found');
    }

    return await this.getRestaurantDetails(id);
  }
}
