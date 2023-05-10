import { Controller, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';

import { SubdomainExistsDto } from './dto/subdomain-exists.dto';
import { RestaurantService } from './restaurant.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly _restaurantService: RestaurantService) {}

  @UsePipes(ValidationPipe)
  @Get('subdomain-exists/:subdomain')
  public isSubdomainExist(@Param() subdomainExistsDto: SubdomainExistsDto): Promise<boolean> {
    return this._restaurantService.isSubdomainExists(subdomainExistsDto.subdomain);
  }
}
