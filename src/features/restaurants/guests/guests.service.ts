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
import { RestaurantsService } from '@features/restaurants/restaurants.service';
import { RTable } from '@features/restaurants/tables/tables.model';
import { UsersService } from '@features/users/users.service';

import { IStatusResponse } from '@shared/interfaces';

import { Guest } from './guests.model';
import { Restaurant } from '../restaurants.model';
import { TablesService } from '../tables/tables.service';
import { WaitersService } from '../waiters/waiters.service';

@Injectable()
export class GuestsService {
  constructor(
    @InjectModel(Guest) private _guestRepository: typeof Guest,
    @InjectModel(Restaurant) private _restaurantRepository: typeof Restaurant,
    private readonly _notificationsService: NotificationsService,
    private readonly _usersService: UsersService,
    private readonly _tablesService: TablesService,
    private readonly _waitersService: WaitersService,
    private readonly _restaurantsService: RestaurantsService
  ) {}

  public async callWaiter(guestId: string, tableId: string): Promise<IStatusResponse> {
    const guest = await this._getGuest(guestId);
    if (!guest) throw new NotFoundException('Guest not found');

    const table = await this._tablesService.getTableWithZone(tableId);
    if (!table) throw new NotFoundException('Table not found');

    const isActive = await this._restaurantsService.isRestaurantActive(table.restaurantId);
    if (!isActive) {
      return { success: false };
    }

    this._waitersService.sendNotifications(table.restaurantId, table, guest.name);

    const notificationPayload = {
      title: 'Сповіщення',
      body: `Гість ${guest.name} з столу ${table.name} покликав офіціанта`
    };
    const data: INotificationFromGuest = {
      guestName: guest.name,
      tableName: table.name
    };
    await this._sendNotificationsToAdmins(
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
    await this._guestRepository.create({
      tableId,
      id: guestId,
      name: guestName
    });

    return { success: true };
  }

  private _getGuest(id: string): Promise<Guest> {
    return this._guestRepository.findOne({ where: { id } });
  }

  private async _sendNotificationsToAdmins(
    tableId: string,
    type: NotificationTypeEnum,
    data: INotificationData,
    payload: INotificationPayload
  ): Promise<void> {
    const table = await this._tablesService.getTable(tableId);
    const admins = await this._usersService.getRestaurantAdmins(table.restaurantId);

    for (const admin of admins) {
      await this._notificationsService.sendNotification(
        admin.id,
        admin.devices.map(device => device.token),
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
