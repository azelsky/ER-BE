import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateOptions } from 'sequelize/types/model';

import { CreateRestaurantDto } from './dto/create-restaurant.dto';
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

  public async getMyRestaurants(cognitoId: string): Promise<Restaurant[]> {
    return await this._restaurantRepository.findAll({
      include: [
        {
          model: User,
          where: { cognitoId },
          attributes: []
        },
        {
          model: Role,
          through: { attributes: [] },
          attributes: {
            exclude: ['id']
          }
        }
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });
  }
}
