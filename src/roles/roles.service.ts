import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Roles } from '@shared/constants';

import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.model';

@Injectable()
export class RolesService {
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

  public async getRoles(): Promise<Role[]> {
    return this._roleRepository.findAll();
  }
}
