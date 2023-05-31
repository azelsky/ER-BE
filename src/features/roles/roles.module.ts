import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from '@features/users/users.model';

import { UserRole } from '@relations/user-role/user-role.model';

import { RolesController } from './roles.controller';
import { Role } from './roles.model';
import { RolesService } from './roles.service';

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [SequelizeModule.forFeature([Role, User, UserRole])],
  exports: [RolesService]
})
export class RolesModule {}
