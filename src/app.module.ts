import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@core/auth/auth.module';
import { DatabaseModule } from '@core/database/database.module';

import { RestaurantsModule } from '@features/restaurants';
import { RolesModule } from '@features/roles';
import { UsersModule } from '@features/users';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    UsersModule,
    RolesModule,
    RestaurantsModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    DatabaseModule,
    AuthModule
  ]
})
export class AppModule {}
