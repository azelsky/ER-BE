import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { IWhere } from '@shared/interfaces';

import { Zone } from './zones.model';

@Injectable()
export class ZonesService {
  constructor(@InjectModel(Zone) private readonly _zoneRepository: typeof Zone) {}

  public async getZones(restaurantId: string): Promise<Zone[]> {
    const zonesWhere: IWhere<Zone> = {
      restaurantId
    };

    return this._zoneRepository.findAll({
      where: zonesWhere
    });
  }
}
