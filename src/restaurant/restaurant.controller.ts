import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { SkipAuthGuard } from '@auth/decorators';

import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { SubdomainExistsDto } from './dto/subdomain-exists.dto';
import { Restaurant } from './restaurant.model';
import { RestaurantService } from './restaurant.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly _restaurantService: RestaurantService) {}

  @SkipAuthGuard()
  @Get('subdomain-exists/:subdomain')
  public isSubdomainExist(@Param() subdomainExistsDto: SubdomainExistsDto): Promise<boolean> {
    return this._restaurantService.isSubdomainExists(subdomainExistsDto.subdomain);
  }

  @Post()
  public async create(@Body() dto: CreateRestaurantDto): Promise<Restaurant> {
    return this._restaurantService.create(dto);
  }
}
