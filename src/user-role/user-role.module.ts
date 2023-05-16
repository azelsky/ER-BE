import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserRole } from './user-role.model';
import { Role } from '../role/role.model';
import { User } from '../user/users.model';

@Module({
  imports: [SequelizeModule.forFeature([Role, User, UserRole])]
})
export class UserRoleModule {}
