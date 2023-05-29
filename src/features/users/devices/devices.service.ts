import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { IStatusResponse } from '@shared/interfaces';

import { Device } from './devices.model';

@Injectable()
export class DevicesService {
  constructor(@InjectModel(Device) private _deviceRepository: typeof Device) {}

  public async addDevice(
    deviceId: string,
    userId: string,
    token: string
  ): Promise<IStatusResponse> {
    await this._deviceRepository.create({ id: deviceId, userId, token });
    return { success: true };
  }

  public async deleteDevice(deviceId: string): Promise<IStatusResponse> {
    await this._deviceRepository.destroy({ where: { id: deviceId } });
    return { success: true };
  }
}
