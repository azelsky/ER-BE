import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { UsersService } from '@features/users/users.service';

import { IStatusResponse } from '@shared/interfaces';
import { NotificationsService } from '@shared/modules/notifications';
import { INotificationPayload } from '@shared/modules/notifications/models';

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

    const notificationPayload = {
      title: 'Request',
      body: `Come up to ${table.name} table`
    };
    await this._sendNotificationsToWaiter(guest.tableId, notificationPayload);

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

    const notificationPayload = {
      title: 'New Guest',
      body: `${guest.name} joined table ${table.name}`
    };
    await this._sendNotificationsToWaiter(tableId, notificationPayload);

    return { success: true };
  }

  private _getGuest(id: string): Promise<Guest> {
    return this._guestRepository.findOne({ where: { id } });
  }

  private async _sendNotificationsToWaiter(
    tableId: string,
    payload: INotificationPayload
  ): Promise<void> {
    // toDo check if a waiter at work
    // toDO if !waiters.length send notification to all waiters
    const waiters = await this._usersService.getTableWaiters(tableId);
    for (const waiter of waiters) {
      for (const device of waiter.devices) {
        await this._notificationsService.sendNotification(device.token, payload);
      }
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
