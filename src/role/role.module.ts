import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { RoleController } from './role.controller';
import { Role } from './role.model';
import { RoleService } from './role.service';
import { User } from '../user/user.model';
import { UserRole } from '../user-role/user-role.model';

@Module({
  providers: [RoleService],
  controllers: [RoleController],
  imports: [SequelizeModule.forFeature([Role, User, UserRole])]
})
export class RoleModule {}