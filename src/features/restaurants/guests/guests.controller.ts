import { Body, Controller, Post } from '@nestjs/common';

import { SkipAuthGuard } from '@core/auth/decorators';

import { GuestsService } from '@features/restaurants/guests/guests.service';

import { IStatusResponse } from '@shared/interfaces';
import { NotificationsService } from '@shared/modules/notifications';

import { InitGuestDto } from './dto';

@Controller('restaurants/:restaurantId/guests')
export class GuestsController {
  constructor(
    private readonly _notificationsService: NotificationsService,
    private readonly _guestsService: GuestsService
  ) {}

  @SkipAuthGuard()
  @Post('call-waiter')
  public async callWaiter(): Promise<string> {
    const token =
      'fupv8vvULMemzTXd5_0-vT:APA91bFBXj-woHEhDB4NTcbsGVWUuXnWknceCZoSMccpfbkXOqloYGoz4Djq96aUlJgUUc8z739xGTrrHsRZryP4eF51LeCEcGXtHEV5AaMxxrbaikDScrLUFLUHVKYOTSWq2QVvstTq';
    return this._notificationsService.sendNotification(token, {
      title: 'Title',
      body: 'Some body'
    });
  }

  @SkipAuthGuard()
  @Post('join-table')
  public joinTable(@Body() dto: InitGuestDto): Promise<IStatusResponse> {
    return this._guestsService.initGuest(dto.tableId, dto.guestId);
  }
}
