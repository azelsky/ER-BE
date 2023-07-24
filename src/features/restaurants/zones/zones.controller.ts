import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { IDeletedEntity } from '@shared/interfaces';

import { CreateUpdateZoneDto } from './zones.dto';
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

  @Post('create')
  public createZone(
    @Body() zone: CreateUpdateZoneDto,
    @Param('restaurantId') restaurantId: string
  ): Promise<IZone> {
    return this._zoneService.createZone({ ...zone, restaurantId });
  }

  @Put(':zoneId')
  public editZone(
    @Body() zone: CreateUpdateZoneDto,
    @Param('zoneId') zoneId: string
  ): Promise<IZone> {
    return this._zoneService.editZone(zoneId, zone);
  }

  @Delete(':zoneId')
  public delete(@Param('zoneId') zoneId: string): Promise<IDeletedEntity> {
    return this._zoneService.delete(zoneId);
  }
}
