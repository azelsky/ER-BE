import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Role } from './role/role.model';
import { RoleModule } from './role/role.module';
import { User } from './user/user.model';
import { UserModule } from './user/user.module';
import { UserRole } from './user-role/user-role.model';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    UserModule,
    RoleModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.USER,
      password: process.env.PASSWORD,
      database: 're',
      models: [User, Role, UserRole],
      autoLoadModels: true
    })
  ]
})
export class AppModule {}
