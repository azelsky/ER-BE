import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role.model';
import { Roles } from '../shared/constants';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role) private _roleRepository: typeof Role) {}

  public async createRole(dto: CreateRoleDto): Promise<CreateRoleDto> {
    return this._roleRepository.create(dto);
  }

  public async getRoleByValue(value: Roles): Promise<Role> {
    const role = await this._roleRepository.findOne({ where: { value } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }
}
