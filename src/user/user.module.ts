import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserController } from './user.controller';
import { User } from './user.model';
import { UserService } from './user.service';
import { Role } from '../role/role.model';
import { UserRole } from '../user-role/user-role.model';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [SequelizeModule.forFeature([User, Role, UserRole])]
})
export class UserModule {}
