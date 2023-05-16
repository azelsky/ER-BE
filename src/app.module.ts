import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { RestaurantsModule } from './restaurant/restaurants.module';
import { RoleModule } from './role/role.module';
import { UsersModule } from './user/users.module';
import { UserRestaurantModule } from './user-restaurant/user-restaurant.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    UsersModule,
    RoleModule,
    RestaurantsModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    DatabaseModule,
    UserRestaurantModule,
    AuthModule
  ]
})
export class AppModule {}
