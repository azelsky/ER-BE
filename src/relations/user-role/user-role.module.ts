import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Role } from '@features/roles/roles.model';
import { User } from '@features/users/users.model';

import { UserRole } from './user-role.model';

@Module({
  imports: [SequelizeModule.forFeature([Role, User, UserRole])]
})
export class UserRoleModule {}
