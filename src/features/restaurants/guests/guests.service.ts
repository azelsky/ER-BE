import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { NotificationsService } from '@features/notifications';
import {
  INotificationData,
  INotificationFromGuest,
  INotificationPayload,
  NotificationTypeEnum
} from '@features/notifications/interfaces';
import { UsersService } from '@features/users/users.service';

import { IStatusResponse } from '@shared/interfaces';

import { Guest } from './guests.model';
import { TablesService } from '../tables/tables.service';

@Injectable()
export class GuestsService {
  constructor(
    @InjectModel(Guest) private _guestRepository: typeof Guest,
    private readonly _notificationsService: NotificationsService,
    private readonly _usersService: UsersService,
    private readonly _tablesService: TablesService
  ) {}

  public async callWaiter(guestId: string): Promise<IStatusResponse> {
    const guest = await this._getGuest(guestId);
    if (!guest) throw new NotFoundException('Guest not found');

    const table = await this._tablesService.getTable(guest.tableId);

    // toDO translate
    const notificationPayload = {
      title: 'Request',
      body: `Come up to ${table.name} table. ${guest.name} call you`
    };
    const data: INotificationFromGuest = {
      guestName: guest.name,
      tableName: table.name
    };
    await this._sendNotificationsToWaiters(
      guest.tableId,
      NotificationTypeEnum.CallWaiter,
      data,
      notificationPayload
    );

    return { success: true };
  }

  public async initGuest(tableId: string, guestId: string): Promise<IStatusResponse> {
    const isRegistered = await this._getGuest(guestId);
    if (isRegistered) {
      return { success: true };
    }

    const guest = await this._guestRepository.create({
      tableId,
      id: guestId,
      name: this._generateGuestName()
    });
    const table = await this._tablesService.getTable(tableId);

    // toDO translate
    const notificationPayload = {
      title: 'New Guest',
      body: `${guest.name} joined table ${table.name}`
    };
    const data: INotificationFromGuest = {
      guestName: guest.name,
      tableName: table.name
    };
    await this._sendNotificationsToWaiters(
      tableId,
      NotificationTypeEnum.NewGuest,
      data,
      notificationPayload
    );

    return { success: true };
  }

  private _getGuest(id: string): Promise<Guest> {
    return this._guestRepository.findOne({ where: { id } });
  }

  private async _sendNotificationsToWaiters(
    tableId: string,
    type: NotificationTypeEnum,
    data: INotificationData,
    payload: INotificationPayload
  ): Promise<void> {
    // toDo check if a waiter at work
    let waiters = await this._usersService.getTableWaiters(tableId);
    if (!waiters.length) {
      const table = await this._tablesService.getTable(tableId);
      waiters = await this._usersService.getAllRestaurantWaiters(table.restaurantId);
    }
    for (const waiter of waiters) {
      await this._notificationsService.sendNotification(
        waiter.id,
        waiter.devices.map(device => device.token),
        type,
        data,
        payload
      );
    }
  }

  private _generateGuestName(): string {
    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}:${seconds}`;
    return `Guest ${currentTime}`;
  }
}
