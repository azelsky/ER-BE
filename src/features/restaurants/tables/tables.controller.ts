import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { CreateTableDto } from '@features/restaurants/tables/dto';

import { Roles } from '@shared/constants';
import { RolesAllowed } from '@shared/decorators/roles-allowed.decorator';
import { RolesGuard } from '@shared/guards/roles.guard';

import { RTable } from './tables.model';
import { TablesService } from './tables.service';

@Controller('restaurants/:restaurantId/tables')
export class TablesController {
  constructor(private readonly _tablesService: TablesService) {}

  @RolesAllowed(Roles.Admin)
  @UseGuards(RolesGuard)
  @Post('create')
  public create(
    @Param('restaurantId') restaurantId: string,
    @Body() body: CreateTableDto
  ): Promise<RTable> {
    return this._tablesService.create(restaurantId, body.name);
  }
}
