import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';

import { SkipAuthGuard } from '@auth/decorators';
import { IAuthRequest } from '@auth/interfaces';

import { Roles } from '@shared/constants';
import { RolesAllowed } from '@shared/decorators/roles-allowed.decorator';
import { RolesGuard } from '@shared/guards/roles.guard';

import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { RestaurantIdParameterDto } from './dto/restaurant-id-parameter.dto';
import { SubdomainParameterDto } from './dto/subdomain-parameter.dto';
import { TRestaurantDetails } from './interfaces/reataurant-details.type';
import { IRelatedRestaurant } from './interfaces/related-restaurant.interface';
import { Restaurant } from './restaurants.model';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly _restaurantsService: RestaurantsService) {}

  @SkipAuthGuard()
  @Get('subdomain-exists/:subdomain')
  public isSubdomainExist(@Param() { subdomain }: SubdomainParameterDto): Promise<boolean> {
    return this._restaurantsService.isSubdomainExists(subdomain);
  }

  @Post()
  public async create(@Body() dto: CreateRestaurantDto): Promise<Restaurant> {
    return this._restaurantsService.create(dto);
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
}
