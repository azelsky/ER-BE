import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';

import { SkipAuthGuard } from '@auth/decorators';
import { IAuthRequest } from '@auth/interfaces';

import { Roles } from '@shared/constants';
import { RolesAllowed } from '@shared/decorators/roles-allowed.decorator';
import { RolesGuard } from '@shared/guards/roles.guard';
import { IDeletedEntity } from '@shared/interfaces';

import { CreateRestaurantDto } from '../dto/create-restaurant.dto';
import { RestaurantIdParameterDto } from '../dto/restaurant-id-parameter.dto';
import { SubdomainParameterDto } from '../dto/subdomain-parameter.dto';
import { TRestaurantDetails } from '../interfaces/reataurant-details.type';
import { IRelatedRestaurant } from '../interfaces/related-restaurant.interface';
import { RestaurantsService } from '../services/restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly _restaurantsService: RestaurantsService) {}

  @SkipAuthGuard()
  @Get('subdomain-exists/:subdomain')
  public isSubdomainExist(@Param() { subdomain }: SubdomainParameterDto): Promise<boolean> {
    return this._restaurantsService.isSubdomainExists(subdomain);
  }

  @Post('create')
  public async create(
    @Body() dto: CreateRestaurantDto,
    @Req() request: IAuthRequest
  ): Promise<TRestaurantDetails> {
    return this._restaurantsService.createRestaurantForUser(request.user.idUser, dto);
  }

  @Get()
  public async getRelatedRestaurants(@Req() request: IAuthRequest): Promise<IRelatedRestaurant[]> {
    return this._restaurantsService.getRelatedRestaurants(request.user.idUser);
  }

  @RolesAllowed(Roles.Admin)
  @UseGuards(RolesGuard)
  @Get(':restaurantId')
  public async getRestaurantDetails(
    @Param() { restaurantId }: RestaurantIdParameterDto
  ): Promise<TRestaurantDetails> {
    return this._restaurantsService.getRestaurantDetails(restaurantId);
  }

  @RolesAllowed(Roles.Admin)
  @UseGuards(RolesGuard)
  @Put(':restaurantId')
  public async updateRestaurantDetails(
    @Param('restaurantId') id: string,
    @Body() data: Partial<TRestaurantDetails>
  ): Promise<TRestaurantDetails> {
    return this._restaurantsService.updateRestaurantDetails(id, data);
  }

  @RolesAllowed(Roles.Owner)
  @UseGuards(RolesGuard)
  @Delete(':restaurantId')
  public async deleteRestaurant(@Param('restaurantId') id: string): Promise<IDeletedEntity> {
    await this._restaurantsService.delete(id);
    return { id };
  }
}
