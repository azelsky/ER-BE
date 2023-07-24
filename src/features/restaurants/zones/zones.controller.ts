import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { SkipAuthGuard } from '@core/auth/decorators';

import { IDeletedEntity } from '@shared/interfaces';

import { CreateZoneDto } from './zones.dto';
import { IZone } from './zones.interface';
import { Zone } from './zones.model';
import { ZonesService } from './zones.service';

@Controller('restaurants/:restaurantId/zones')
export class ZonesController {
  constructor(private readonly _zoneService: ZonesService) {}

  @Get()
  public get(@Param('restaurantId') restaurantId: string): Promise<Zone[]> {
    return this._zoneService.getZones(restaurantId);
  }

  @SkipAuthGuard()
  @Post('create')
  public createZone(
    @Body() zone: CreateZoneDto,
    @Param('restaurantId') restaurantId: string
  ): Promise<IZone> {
    return this._zoneService.createZone({ ...zone, restaurantId });
  }

  @Delete(':zoneId')
  public delete(@Param('zoneId') zoneId: string): Promise<IDeletedEntity> {
    return this._zoneService.delete(zoneId);
  }
}
