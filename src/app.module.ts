import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@core/auth/auth.module';
import { DatabaseModule } from '@core/database/database.module';

import { NotificationsModule } from '@features/notifications/notifications.module';
import { RestaurantsModule } from '@features/restaurants/restaurants.module';
import { RolesModule } from '@features/roles/roles.module';
import { UsersModule } from '@features/users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    UsersModule,
    RolesModule,
    RestaurantsModule,
    NotificationsModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    DatabaseModule,
    AuthModule
  ]
})
export class AppModule {}
