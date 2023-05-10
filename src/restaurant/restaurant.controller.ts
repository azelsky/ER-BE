import { Body, ConflictException, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { SubdomainExistsDto } from './dto/subdomain-exists.dto';
import { Restaurant } from './restaurant.model';
import { RestaurantService } from './restaurant.service';
import { SkipAuthGuard } from '../core/decorators/skip-auth.decorator';

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
    const subdomainExists = await this._restaurantService.isSubdomainExists(dto.subdomain);
    if (subdomainExists) {
      throw new ConflictException('Subdomain already exists');
    }

    return this._restaurantService.create(dto);
  }
}
