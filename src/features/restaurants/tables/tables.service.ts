import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { IAttributes } from '@shared/interfaces';

import { RTable } from './tables.model';
import { Zone } from '../zones/zones.model';

@Injectable()
export class TablesService {
  constructor(@InjectModel(RTable) private _tableRepository: typeof RTable) {}

  public async getTable(tableId: string): Promise<RTable> {
    return this._tableRepository.findOne({ where: { id: tableId } });
  }

  public async getTableWithZone(tableId: string): Promise<RTable> {
    return this._tableRepository.findOne({ where: { id: tableId }, include: [{ model: Zone }] });
  }

  public create(restaurantId: string, name: string): Promise<RTable> {
    return this._tableRepository.create({ name, restaurantId });
  }

  public delete(id: string): Promise<number> {
    return this._tableRepository.destroy({ where: { id } });
  }

  public async edit(id: string, data: Partial<RTable>): Promise<RTable> {
    const [rowCount] = await this._tableRepository.update(data, {
      where: { id }
    });

    if (rowCount === 0) {
      throw new NotFoundException('Table not found');
    }

    return this.getTable(id);
  }

  public getTables(restaurantId): Promise<RTable[]> {
    const excludeTableFields: IAttributes<RTable> = ['createdAt', 'updatedAt'];
    const orderField: keyof RTable = 'createdAt';

    return this._tableRepository.findAll({
      where: { restaurantId },
      attributes: { exclude: excludeTableFields },
      order: [[orderField, 'ASC']]
    });
  }
}
