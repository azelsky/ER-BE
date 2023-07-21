import { Controller, Get, Param } from '@nestjs/common';

import { Zone } from './zones.model';
import { ZonesService } from './zones.service';

@Controller('restaurants/:restaurantId/zones')
export class ZonesController {
  constructor(private readonly _zoneService: ZonesService) {}

  @Get()
  public get(@Param('restaurantId') restaurantId: string): Promise<Zone[]> {
    return this._zoneService.getZones(restaurantId);
  }
}
