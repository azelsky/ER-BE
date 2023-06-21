import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { SkipAuthGuard } from '@core/auth/decorators';

import { Waiter } from '@features/restaurants/waiters/waiters.model';

import { TelegramGuard } from '@shared/guards/telegram.guard';
import { IStatusResponse } from '@shared/interfaces';

import { ConfirmWaiterDto, CreateWaiterDto, IsAuthorizedDto } from './waiters.dto';
import { WaitersService } from './waiters.service';

@Controller('restaurants/waiters')
export class WaitersController {
  constructor(private readonly _waitersService: WaitersService) {}

  @Post('create')
  public create(@Body() data: CreateWaiterDto): Promise<Waiter> {
    return this._waitersService.create(data.name, data.restaurantId);
  }

  @SkipAuthGuard()
  @UseGuards(TelegramGuard)
  @Post('confirm')
  public confirm(@Body() data: ConfirmWaiterDto): Promise<IStatusResponse> {
    return this._waitersService.confirm(
      data.confirmationCode,
      data.messengerUserId,
      data.messengerType
    );
  }

  @SkipAuthGuard()
  @UseGuards(TelegramGuard)
  @Post(':messengerUserId')
  public getAuthorizedWaiter(
    @Param() { messengerUserId }: IsAuthorizedDto
  ): Promise<Waiter | null> {
    return this._waitersService.getAuthorizedWaiter(messengerUserId);
  }

  @SkipAuthGuard()
  @UseGuards(TelegramGuard)
  @Post(':messengerUserId/notifications/enable')
  public enableNotifications(
    @Param() { messengerUserId }: IsAuthorizedDto
  ): Promise<IStatusResponse> {
    return this._waitersService.changeIsWorkingStatus(messengerUserId, true);
  }

  @SkipAuthGuard()
  @UseGuards(TelegramGuard)
  @Post(':messengerUserId/notifications/disable')
  public disableNotifications(
    @Param() { messengerUserId }: IsAuthorizedDto
  ): Promise<IStatusResponse> {
    return this._waitersService.changeIsWorkingStatus(messengerUserId, false);
  }
}