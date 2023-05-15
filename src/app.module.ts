import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { UserRestaurantModule } from './user-restaurant/user-restaurant.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    UserModule,
    RoleModule,
    RestaurantModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    DatabaseModule,
    UserRestaurantModule,
    AuthModule
  ]
})
export class AppModule {}
