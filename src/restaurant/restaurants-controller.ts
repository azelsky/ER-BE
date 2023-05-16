import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';

import { SkipAuthGuard } from '@auth/decorators';
import { IAuthRequest } from '@auth/interfaces';

import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { SubdomainExistsDto } from './dto/subdomain-exists.dto';
import { Restaurant } from './restaurants.model';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly _restaurantsService: RestaurantsService) {}

  @SkipAuthGuard()
  @Get('subdomain-exists/:subdomain')
  public isSubdomainExist(@Param() subdomainExistsDto: SubdomainExistsDto): Promise<boolean> {
    return this._restaurantsService.isSubdomainExists(subdomainExistsDto.subdomain);
  }

  @Post()
  public async create(@Body() dto: CreateRestaurantDto): Promise<Restaurant> {
    return this._restaurantsService.create(dto);
  }

  @Get()
  public async getMyRestaurants(@Req() request: IAuthRequest): Promise<Restaurant[]> {
    return this._restaurantsService.getMyRestaurants(request.user.idUser);
  }
}
