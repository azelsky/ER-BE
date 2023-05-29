import { Controller, Post } from '@nestjs/common';

import { SkipAuthGuard } from '@core/auth/decorators';

import { NotificationsService } from '@shared/modules/notifications';

@Controller('restaurants/:restaurantId/guests')
export class GuestsController {
  constructor(private readonly _notificationsService: NotificationsService) {}

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
}
