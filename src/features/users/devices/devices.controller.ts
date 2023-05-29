import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { Delete } from '@nestjs/common';

import { IAuthRequest } from '@core/auth/interfaces';

import { IStatusResponse } from '@shared/interfaces';

import { DevicesService } from './devices.service';
import { AddDeviceDto } from './dto';
import { UsersService } from '../users.service';

@Controller('users/devices')
export class DevicesController {
  constructor(
    private readonly _devicesServe: DevicesService,
    private readonly _usersService: UsersService
  ) {}

  @Post('add')
  public async add(
    @Body() body: AddDeviceDto,
    @Req() request: IAuthRequest
  ): Promise<IStatusResponse> {
    const user = await this._usersService.getUserByCognitoId(request.user.idUser);

    return this._devicesServe.addDevice(body.deviceId, user.id, body.token);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<IStatusResponse> {
    return this._devicesServe.deleteDevice(id);
  }
}
