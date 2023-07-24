import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable } from 'sequelize/types/model';
import { Sequelize } from 'sequelize-typescript';

import { IAttributes, IDeletedEntity, IWhere } from '@shared/interfaces';

import { IZoneTableCreationAttr, ZoneTable } from './zone-table.model';
import { IZoneWaiterCreationAttr, ZoneWaiter } from './zone-waiter.model';
import { IZone, IZoneUpdateAttr } from './zones.interface';
import { IZoneCreationAttr, Zone } from './zones.model';
import { RTable } from '../tables/tables.model';
import { Waiter } from '../waiters/waiters.model';

@Injectable()
export class ZonesService {
  constructor(
    @InjectModel(Zone) private readonly _zoneRepository: typeof Zone,
    @InjectModel(ZoneTable) private readonly _zoneTableRepository: typeof ZoneTable,
    @InjectModel(ZoneWaiter) private readonly _zoneWaiterRepository: typeof ZoneWaiter,
    private readonly _sequelize: Sequelize
  ) {}

  public async getZones(restaurantId: string): Promise<Zone[]> {
    const zonesWhere: IWhere<Zone> = {
      restaurantId
    };
    const orderField: keyof Zone = 'createdAt';

    return this._zoneRepository.findAll({
      where: zonesWhere,
      include: this._getRelatedZoneRecords(),
      order: [[orderField, 'ASC']]
    });
  }

  public async delete(id: string): Promise<IDeletedEntity> {
    await this._zoneRepository.destroy({
      where: { id }
    });

    return { id };
  }

  public async createZone(data: IZoneCreationAttr): Promise<IZone> {
    const t = await this._sequelize.transaction();

    try {
      const zone = await this._zoneRepository.create(data, { transaction: t });

      if (data.tables && data.tables.length > 0) {
        const zoneTableData: IZoneTableCreationAttr[] = data.tables.map(table => ({
          zoneId: zone.id,
          tableId: table.id
        }));
        await this._zoneTableRepository.bulkCreate(zoneTableData, { transaction: t });
      }
      if (data.waiters && data.waiters.length > 0) {
        const zoneWaiterData: IZoneWaiterCreationAttr[] = data.waiters.map(waiter => ({
          zoneId: zone.id,
          waiterId: waiter.id
        }));
        await this._zoneWaiterRepository.bulkCreate(zoneWaiterData, { transaction: t });
      }

      await t.commit();
      return await this._getZone(zone.id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  public async editZone(zoneId: string, data: IZoneUpdateAttr): Promise<IZone> {
    const t = await this._sequelize.transaction();

    try {
      const zone = await this._zoneRepository.findByPk(zoneId, { transaction: t });

      if (!zone) {
        throw new NotFoundException('Zone not found');
      }

      await zone.update(data, { transaction: t });

      if (data.tables) {
        const existingTables = await this._zoneTableRepository.findAll({
          where: { zoneId: zone.id },
          transaction: t
        });
        const existingTableIds = new Set(existingTables.map(table => table.tableId));

        for (const table of data.tables) {
          const tableId = table.id;
          if (!existingTableIds.has(tableId)) {
            await this._zoneTableRepository.create(
              { zoneId: zone.id, tableId },
              { transaction: t }
            );
          }
        }

        for (const existingTable of existingTables) {
          if (!data.tables.some(table => table.id === existingTable.tableId)) {
            await existingTable.destroy({ transaction: t });
          }
        }
      }

      if (data.waiters) {
        const existingWaiters = await this._zoneWaiterRepository.findAll({
          where: { zoneId: zone.id },
          transaction: t
        });
        const existingWaiterIds = new Set(existingWaiters.map(waiter => waiter.waiterId));

        for (const waiter of data.waiters) {
          const waiterId = waiter.id;
          if (!existingWaiterIds.has(waiterId)) {
            await this._zoneWaiterRepository.create(
              { zoneId: zone.id, waiterId },
              { transaction: t }
            );
          }
        }

        for (const existingWaiter of existingWaiters) {
          if (!data.waiters.some(waiter => waiter.id === existingWaiter.waiterId)) {
            await existingWaiter.destroy({ transaction: t });
          }
        }
      }

      await t.commit();
      return await this._getZone(zone.id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  private async _getZone(zoneId: string): Promise<IZone> {
    const where: IWhere<Zone> = { id: zoneId };

    return this._zoneRepository.findOne({
      where,
      include: this._getRelatedZoneRecords()
    });
  }

  private _getRelatedZoneRecords(): Includeable[] {
    const waiterAttr: IAttributes<Waiter> = ['name', 'id'];
    const tableAttr: IAttributes<RTable> = ['name', 'id'];

    return [
      { model: Waiter, attributes: waiterAttr, through: { attributes: [] } },
      { model: RTable, attributes: tableAttr, through: { attributes: [] } }
    ];
  }
}
