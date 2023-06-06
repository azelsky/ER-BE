import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UsersModule } from '@features/users/users.module';

import { Notification } from './notification.model';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  providers: [NotificationsService],
  exports: [NotificationsService],
  imports: [SequelizeModule.forFeature([Notification]), UsersModule],
  controllers: [NotificationsController]
})
export class NotificationsModule {}
