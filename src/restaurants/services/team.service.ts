import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Role } from 'src/roles/roles.model';

import { User } from '../../users/users.model';
import { TTeamMember } from '../interfaces/team-member';

@Injectable()
export class TeamService {
  constructor(@InjectModel(User) private _userRepository: typeof User) {}

  public getTeam(restaurantId: string): Promise<TTeamMember[]> {
    const teamMemberAttributes: (keyof TTeamMember)[] = ['id', 'name', 'email'];

    return this._userRepository.findAll({
      attributes: teamMemberAttributes,
      include: [
        {
          model: Role,
          through: { where: { restaurantId }, attributes: [] }
        }
      ],
      where: { '$roles.id$': { [Op.ne]: null } }
    });
  }
}
