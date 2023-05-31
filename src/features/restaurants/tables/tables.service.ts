import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { RTable } from './tables.model';

@Injectable()
export class TablesService {
  constructor(@InjectModel(RTable) private _tableRepository: typeof RTable) {}

  public async getTable(tableId: string): Promise<RTable> {
    return this._tableRepository.findOne({ where: { id: tableId } });
  }

  public create(restaurantId: string, name: string): Promise<RTable> {
    return this._tableRepository.create({ name, restaurantId });
  }
}
