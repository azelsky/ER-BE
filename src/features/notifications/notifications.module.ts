import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Notification } from './notification.model';
import { NotificationsService } from './notifications.service';

@Module({
  providers: [NotificationsService],
  exports: [NotificationsService],
  imports: [SequelizeModule.forFeature([Notification])]
})
export class NotificationsModule {}
