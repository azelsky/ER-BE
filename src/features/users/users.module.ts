import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { DevicesController } from './devices/devices.controller';
import { Device } from './devices/devices.model';
import { DevicesService } from './devices/devices.service';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController, DevicesController],
  providers: [UsersService, DevicesService],
  imports: [SequelizeModule.forFeature([User, Device])],
  exports: [UsersService]
})
export class UsersModule {}
