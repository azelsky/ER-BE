import { Body, Controller, Post } from '@nestjs/common';

import { SkipAuthGuard } from '@core/auth/decorators';

import { NotificationsService } from '@features/notifications';
import { GuestsService } from '@features/restaurants/guests/guests.service';

import { IStatusResponse } from '@shared/interfaces';

import { CallWaiterDto, InitGuestDto } from './dto';

@Controller('restaurants/guest')
export class GuestsController {
  constructor(
    private readonly _notificationsService: NotificationsService,
    private readonly _guestsService: GuestsService
  ) {}

  @SkipAuthGuard()
  @Post('call-waiter')
  public async callWaiter(@Body() dto: CallWaiterDto): Promise<IStatusResponse> {
    return this._guestsService.callWaiter(dto.guestId);
  }

  @SkipAuthGuard()
  @Post('init')
  public joinTable(@Body() dto: InitGuestDto): Promise<IStatusResponse> {
    return this._guestsService.initGuest(dto.tableId, dto.guestId);
  }
}
