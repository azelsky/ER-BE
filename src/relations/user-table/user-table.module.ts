import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserTable } from './user-table.model';

@Module({
  imports: [SequelizeModule.forFeature([UserTable])]
})
export class UserTableModule {}
