import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role.model';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role) private _roleRepository: typeof Role) {}

  public async createRole(dto: CreateRoleDto): Promise<CreateRoleDto> {
    return this._roleRepository.create(dto);
  }

  public getRoleByValue(value: string): Promise<CreateRoleDto | null> {
    return this._roleRepository.findOne({ where: { value } });
  }
}
