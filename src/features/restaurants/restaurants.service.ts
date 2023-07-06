import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateOptions } from 'sequelize/types/model';
import { Sequelize } from 'sequelize-typescript';

import { Role } from '@features/roles/roles.model';
import { RolesService } from '@features/roles/roles.service';
import { User } from '@features/users/users.model';
import { UsersService } from '@features/users/users.service';

import { RestaurantPricingPlan } from '@relations/restaurant-pricing-plan/restaurant-pricing-plan.model';

import { Roles } from '@shared/constants';
import { omit } from '@shared/helper';

import { CreateRestaurantDto } from './dto';
import { TRestaurantDetails, IRelatedRestaurant } from './interfaces';
import { PricingPlansService } from './pricing-plans/pricing-plans.service';
import { Restaurant } from './restaurants.model';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant) private _restaurantRepository: typeof Restaurant,
    private readonly _sequelize: Sequelize,
    private readonly _usersService: UsersService,
    private readonly _rolesService: RolesService,
    private readonly _pricingPlansService: PricingPlansService
  ) {}

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
    const roleAttributes: (keyof Role)[] = ['name', 'value', 'id'];
    const restaurantAttributes: (keyof IRelatedRestaurant)[] = ['id', 'name', 'subdomain'];
    const user = await this._usersService.getUserByCognitoId(cognitoId);
    const omitRestaurantAttr: (keyof Pick<Restaurant, 'plans'>)[] = ['plans'];

    return this._restaurantRepository
      .findAll<Restaurant>({
        include: [
          {
            model: User,
            where: { cognitoId },
            attributes: []
          },
          {
            model: Role,
            through: { attributes: [], where: { userId: user.id } },
            attributes: roleAttributes
          },
          {
            model: RestaurantPricingPlan
          }
        ],
        attributes: restaurantAttributes
      })
      .then(restaurants => {
        return restaurants.map(restaurant => {
          const endDate = this._pricingPlansService.findPricingPlansEndDate(restaurant.plans);
          return {
            ...omit(restaurant.dataValues, omitRestaurantAttr),
            endDate
          };
        });
      });
  }

  public getRestaurantDetails(id: string): Promise<TRestaurantDetails> {
    const attributes: (keyof TRestaurantDetails)[] = ['id', 'name'];

    return this._restaurantRepository.findOne({
      attributes,
      where: { id }
    });
  }

  public async getRestaurantDetailsBySubdomain(subdomain: string): Promise<TRestaurantDetails> {
    const attributes: (keyof TRestaurantDetails)[] = ['id', 'name'];

    const restaurant = await this._restaurantRepository.findOne({
      attributes,
      where: { subdomain }
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
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

  public async createRestaurantForUser(
    cognitoId: string,
    dto: CreateRestaurantDto
  ): Promise<TRestaurantDetails> {
    const transaction = await this._sequelize.transaction();

    try {
      const user = await this._usersService.getUserByCognitoId(cognitoId);

      const restaurant = await this.create(dto, { transaction });

      const ownerRole = await this._rolesService.getRoleByValue(Roles.Owner);

      await user.$add('restaurants', restaurant, { transaction });
      await restaurant.$add('roles', ownerRole, {
        through: { userId: user.id },
        transaction
      });

      await transaction.commit();

      return await this.getRestaurantDetails(restaurant.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public delete(id: string): Promise<number> {
    return this._restaurantRepository.destroy({ where: { id } });
  }
}
