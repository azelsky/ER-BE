import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { Roles } from '@shared/constants';
import { RolesAllowed } from '@shared/decorators/roles-allowed.decorator';
import { RolesGuard } from '@shared/guards/roles.guard';
import { IStatusResponse } from '@shared/interfaces';

import { TeamService } from './team.service';
import { AddTeamMemberDto } from '../dto/add-team-member.dto';
import { UserRoleDto } from '../dto/user-role.dto';
import { TTeamMember } from '../interfaces/team-member';

@Controller('restaurants/:restaurantId/team')
export class TeamController {
  constructor(private readonly _teamService: TeamService) {}

  @RolesAllowed(Roles.Admin)
  @UseGuards(RolesGuard)
  @Get()
  public getTeam(@Param('restaurantId') id: string): Promise<TTeamMember[]> {
    return this._teamService.getTeam(id);
  }

  @RolesAllowed(Roles.Admin)
  @UseGuards(RolesGuard)
  @Post('add-member')
  public addTeamMember(
    @Body() addTeamMemberDto: AddTeamMemberDto,
    @Param('restaurantId') restaurantId: string
  ): Promise<IStatusResponse> {
    return this._teamService.addTeamMember(
      addTeamMemberDto.email,
      addTeamMemberDto.rolesIds,
      restaurantId
    );
  }

  @RolesAllowed(Roles.Admin)
  @UseGuards(RolesGuard)
  @Post('member/add-role')
  public addRoleToMember(
    @Body() body: UserRoleDto,
    @Param('restaurantId') restaurantId: string
  ): Promise<IStatusResponse> {
    return this._teamService.addRoleToMember(body.userId, body.roleId, restaurantId);
  }

  @RolesAllowed(Roles.Admin)
  @UseGuards(RolesGuard)
  @Post('member/delete-role')
  public deleteMemberRole(
    @Body() body: UserRoleDto,
    @Param('restaurantId') restaurantId: string
  ): Promise<IStatusResponse> {
    return this._teamService.deleteMemberRole(body.userId, body.roleId, restaurantId);
  }
}
