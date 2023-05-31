import * as querystring from 'querystring';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

import { UsersService } from '@features/users/users.service';

import { UserRestaurant } from '@relations/user-restaurant/user-restaurant.model';
import { UserRole } from '@relations/user-role/user-role.model';

import { IStatusResponse } from '@shared/interfaces';
import { EmailService } from '@shared/modules/email';

import { TTeamMember } from '../interfaces';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(UserRole) private readonly _userRoleRepository: typeof UserRole,
    @InjectModel(UserRestaurant) private readonly _userRestaurantRepository: typeof UserRestaurant,
    private readonly _usersService: UsersService,
    private readonly _sequelize: Sequelize,
    private readonly _emailService: EmailService
  ) {}

  public getTeam(restaurantId: string): Promise<TTeamMember[]> {
    const teamMemberAttributes: (keyof TTeamMember)[] = ['id', 'name', 'email'];

    return this._usersService.getRestaurantUsers(restaurantId, teamMemberAttributes);
  }

  public async addTeamMember(
    userEmail: string,
    rolesIds: number[],
    restaurantId: string
  ): Promise<IStatusResponse> {
    const transaction = await this._sequelize.transaction();

    try {
      let user = await this._usersService.getUserByEmail(userEmail);

      if (!user) {
        user = await this._usersService.createUser(
          { email: userEmail, name: '', cognitoId: '' },
          { transaction }
        );

        const encodedEmail = querystring.escape(userEmail);

        await this._emailService.send({
          subject: 'Complete Registration',
          to: userEmail,
          html: `
            <h2>Complete Registration</h2>
            <p>To complete your registration, please click the following link:</p>
            <p><a href="http://localhost:5000/complete-registration?email=${encodedEmail}">Complete Registration</a></p>
          `
        });
      }

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
