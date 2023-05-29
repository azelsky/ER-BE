import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Device, DevicesController, DevicesService } from './devices';
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
