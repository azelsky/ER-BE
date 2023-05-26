import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Role } from 'src/roles/roles.model';

import { IStatusResponse } from '@shared/interfaces';

import { UserRestaurant } from '../../user-restaurant/user-restaurant.model';
import { UserRole } from '../../user-role/user-role.model';
import { User } from '../../users/users.model';
import { UsersService } from '../../users/users.service';
import { TTeamMember } from '../interfaces/team-member';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(User) private readonly _userRepository: typeof User,
    @InjectModel(UserRole) private readonly _userRoleRepository: typeof UserRole,
    @InjectModel(UserRestaurant) private readonly _userRestaurantRepository: typeof UserRestaurant,
    private readonly _usersService: UsersService,
    private readonly _sequelize: Sequelize
  ) {}

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

  public async addTeamMember(
    userEmail: string,
    rolesIds: number[],
    restaurantId: string
  ): Promise<IStatusResponse> {
    const transaction = await this._sequelize.transaction();

    try {
      const user = await this._usersService.getUserByEmail(userEmail);

      if (user) {
        const userRoles = rolesIds.map((id: number) => ({
          restaurantId,
          userId: user.id,
          roleId: id
        }));
        await this._userRoleRepository.bulkCreate(userRoles, { transaction });
        await this._userRestaurantRepository.create(
          {
            userId: user.id,
            restaurantId: restaurantId
          },
          { transaction }
        );
      }

      await transaction.commit();

      return { success: true, message: 'Team member added successfully' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async addRoleToMember(
    userId: string,
    roleId: number,
    restaurantId: string
  ): Promise<IStatusResponse> {
    await this._userRoleRepository.create({ userId, roleId, restaurantId });

    return { success: true, message: 'Role added successfully' };
  }

  public async deleteMemberRole(
    userId: string,
    roleId: number,
    restaurantId: string
  ): Promise<IStatusResponse> {
    const transaction = await this._sequelize.transaction();

    try {
      await this._userRoleRepository.destroy({ where: { userId, roleId, restaurantId } });

      const userRoles = await this._userRoleRepository.findAll({
        where: { userId, restaurantId },
        transaction
      });

      if (!userRoles.length) {
        await this._userRestaurantRepository.destroy({
          where: { userId, restaurantId },
          transaction
        });
      }

      await transaction.commit();

      return { success: true, message: 'Role deleted successfully' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
