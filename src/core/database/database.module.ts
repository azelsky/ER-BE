import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { Guest } from '@features/restaurants/guests/guests.model';
import { Restaurant } from '@features/restaurants/restaurants.model';
import { RTable } from '@features/restaurants/tables/tables.model';
import { Role } from '@features/roles/roles.model';
import { Device } from '@features/users/devices/devices.model';
import { User } from '@features/users/users.model';

import { UserRestaurant } from '@relations/user-restaurant/user-restaurant.model';
import { UserRole } from '@relations/user-role/user-role.model';
import { UserTable } from '@relations/user-table/user-table.model';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          dialect: 'postgres',
          host: configService.get('DB_HOST_NAME'),
          port: +configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          models: [
            User,
            Role,
            Restaurant,
            UserRole,
            UserRestaurant,
            Device,
            UserTable,
            Guest,
            RTable
          ],
          autoLoadModels: true,
          dialectOptions: {
            ssl: {
              require: true
            }
          }
        };
      },
      inject: [ConfigService]
    })
  ],
  exports: [SequelizeModule]
})
export class DatabaseModule {}
