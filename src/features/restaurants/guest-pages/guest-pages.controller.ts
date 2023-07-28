import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';

import { Roles } from '@shared/constants';
import { RolesAllowed } from '@shared/decorators/roles-allowed.decorator';
import { RolesGuard } from '@shared/guards/roles.guard';

import { UpdateGuestPageDto } from './guest-pages.dto';
import { GuestPage } from './guest-pages.model';
import { GuestPagesService } from './guest-pages.service';

@Controller('restaurants/:restaurantId/guest-page')
export class GuestPagesController {
  constructor(private readonly _guestPagesService: GuestPagesService) {}

  @Get()
  public async getGuestPage(@Param('restaurantId') restaurantId: string): Promise<GuestPage> {
    return this._guestPagesService.getGuestPage(restaurantId);
  }

  @RolesAllowed(Roles.Admin)
  @UseGuards(RolesGuard)
  @Put()
  public async updateGuestPage(
    @Param('restaurantId') restaurantId: string,
    @Body() guestPage: UpdateGuestPageDto
  ): Promise<GuestPage> {
    return this._guestPagesService.updateGuestPage(guestPage, restaurantId);
  }
}
