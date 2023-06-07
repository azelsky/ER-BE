import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import {
  INotificationData,
  INotificationFromGuest,
  INotificationPayload,
  NotificationTypeEnum
} from '@features/notifications/interfaces';
import { NotificationsService } from '@features/notifications/notifications.service';
import { RTable } from '@features/restaurants/tables/tables.model';
import { UsersService } from '@features/users/users.service';

import { IStatusResponse } from '@shared/interfaces';

import { Guest } from './guests.model';
import { Restaurant } from '../restaurants.model';
import { TablesService } from '../tables/tables.service';

@Injectable()
export class GuestsService {
  constructor(
    @InjectModel(Guest) private _guestRepository: typeof Guest,
    @InjectModel(Restaurant) private _restaurantRepository: typeof Restaurant,
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
      body: `Come up to ${table.name} table. Guest ${guest.name} call you`
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

    const guestName = await this._generateGuestName(tableId);
    const guest = await this._guestRepository.create({
      tableId,
      id: guestId,
      name: guestName
    });
    const table = await this._tablesService.getTable(tableId);

    // toDO translate
    const notificationPayload = {
      title: 'New Guest',
      body: `Guest ${guest.name} joined table ${table.name}`
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

  private async _generateGuestName(tableId: string): Promise<string> {
    const restaurant = await this._restaurantRepository.findOne({
      include: [
        {
          model: RTable,
          where: { id: tableId }
        }
      ]
    });

    const guestsCount = restaurant.guestsCount + 1;
    await restaurant.update({ guestsCount });

    return guestsCount.toString();
  }

  @Cron(CronExpression.EVERY_HOUR)
  private async _deleteExpiredGuests(): Promise<void> {
    const currentTime = new Date();
    const expirationTime = new Date(currentTime.getTime() - 1.5 * 60 * 60 * 1000);
    await this._guestRepository.destroy({
      where: { createdAt: { [Op.lt]: expirationTime } }
    });
  }
}
