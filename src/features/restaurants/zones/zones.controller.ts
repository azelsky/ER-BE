import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';

import { Roles } from '@shared/constants';
import { RolesAllowed } from '@shared/decorators/roles-allowed.decorator';
import { RolesGuard } from '@shared/guards/roles.guard';
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

  @RolesAllowed(Roles.Admin)
  @UseGuards(RolesGuard)
  @Post('create')
  public createZone(
    @Body() zone: CreateUpdateZoneDto,
    @Param('restaurantId') restaurantId: string
  ): Promise<IZone> {
    return this._zoneService.createZone({ ...zone, restaurantId });
  }

  @RolesAllowed(Roles.Admin)
  @UseGuards(RolesGuard)
  @Put(':zoneId')
  public editZone(
    @Body() zone: CreateUpdateZoneDto,
    @Param('zoneId') zoneId: string
  ): Promise<IZone> {
    return this._zoneService.editZone(zoneId, zone);
  }

  @RolesAllowed(Roles.Admin)
  @UseGuards(RolesGuard)
  @Delete(':zoneId')
  public delete(@Param('zoneId') zoneId: string): Promise<IDeletedEntity> {
    return this._zoneService.delete(zoneId);
  }
}
