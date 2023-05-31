import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { UsersService } from '@features/users/users.service';

import { IStatusResponse } from '@shared/interfaces';
import { NotificationsService } from '@shared/modules/notifications';

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

  public async initGuest(tableId: string, guestId: string): Promise<IStatusResponse> {
    const isRegistered = await this._guestRepository.findOne({ where: { id: guestId } });
    if (isRegistered) {
      return { success: true };
    }

    const guest = await this._guestRepository.create({ tableId, id: guestId });
    await this._sendJoinTableNotifications(tableId, guest.name);

    return { success: true };
  }

  private async _sendJoinTableNotifications(tableId: string, guestName: string): Promise<void> {
    const table = await this._tablesService.getTable(tableId);
    // toDo check if a waiter at work
    // toDO if !waiters.length send notification to all waiters
    const waiters = await this._usersService.getTableWaiters(tableId);

    for (const waiter of waiters) {
      for (const device of waiter.devices) {
        const notificationPayload = {
          title: 'New Guest',
          body: `${guestName} joined table ${table.name}`
        };
        await this._notificationsService.sendNotification(device.token, notificationPayload);
      }
    }
  }
}
