import * as process from 'process';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/users.model';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    UserModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.USER,
      password: process.env.PASSWORD,
      database: 're',
      models: [User],
      autoLoadModels: true,
    }),
  ],
})
export class AppModule {}
