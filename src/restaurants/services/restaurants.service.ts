import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateOptions } from 'sequelize/types/model';
import { Sequelize } from 'sequelize-typescript';

import { Roles } from '@shared/constants';

import { Role } from '../../roles/roles.model';
import { RolesService } from '../../roles/roles.service';
import { User } from '../../users/users.model';
import { UsersService } from '../../users/users.service';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';
import { TRestaurantDetails } from '../interfaces/reataurant-details.type';
import { IRelatedRestaurant } from '../interfaces/related-restaurant.interface';
import { RESTAURANT_DETAILS_FIELDS } from '../restaurants.constants';
import { Restaurant } from '../restaurants.model';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant) private _restaurantRepository: typeof Restaurant,
    private readonly _sequelize: Sequelize,
    private readonly _usersService: UsersService,
    private readonly _rolesService: RolesService
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

    return this._restaurantRepository.findAll<Restaurant>({
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
        }
      ],
      attributes: restaurantAttributes
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
