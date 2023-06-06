import { Controller, Get, Req } from '@nestjs/common';

import { IAuthRequest } from '@core/auth/interfaces';

import { INotification } from './interfaces';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly _notificationsService: NotificationsService) {}

  @Get()
  public getUserNotifications(@Req() request: IAuthRequest): Promise<INotification[]> {
    return this._notificationsService.getUserNotifications(request.user.idUser);
  }

  @Get('count')
  public getNewUserNotificationsCount(@Req() request: IAuthRequest): Promise<number> {
    return this._notificationsService.getNewUserNotificationsCount(request.user.idUser);
  }
}
