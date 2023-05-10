import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { SubdomainExistsDto } from './dto/subdomain-exists.dto';
import { Restaurant } from './restaurant.model';
import { RestaurantService } from './restaurant.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly _restaurantService: RestaurantService) {}

  @UsePipes(ValidationPipe)
  @Get('subdomain-exists/:subdomain')
  public isSubdomainExist(@Param() subdomainExistsDto: SubdomainExistsDto): Promise<boolean> {
    return this._restaurantService.isSubdomainExists(subdomainExistsDto.subdomain);
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  public async create(@Body() dto: CreateRestaurantDto): Promise<Restaurant> {
    const subdomainExists = await this._restaurantService.isSubdomainExists(dto.subdomain);
    if (subdomainExists) {
      throw new ConflictException('Subdomain already exists');
    }

    return this._restaurantService.create(dto);
  }
}
