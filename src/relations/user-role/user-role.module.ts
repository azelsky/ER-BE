import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Role } from '@features/roles';
import { User } from '@features/users';

import { UserRole } from './user-role.model';

@Module({
  imports: [SequelizeModule.forFeature([Role, User, UserRole])]
})
export class UserRoleModule {}
