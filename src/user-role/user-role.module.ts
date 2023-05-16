import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserRole } from './user-role.model';
import { Role } from '../roles/roles.model';
import { User } from '../users/users.model';

@Module({
  imports: [SequelizeModule.forFeature([Role, User, UserRole])]
})
export class UserRoleModule {}
