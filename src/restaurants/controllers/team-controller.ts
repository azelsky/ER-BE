import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { Roles } from '@shared/constants';
import { RolesAllowed } from '@shared/decorators/roles-allowed.decorator';
import { RolesGuard } from '@shared/guards/roles.guard';

import { TTeamMember } from '../interfaces/team-member';
import { TeamService } from '../services/team.service';

@Controller('restaurants/:restaurantId/team')
export class TeamController {
  constructor(private readonly _teamService: TeamService) {}

  @RolesAllowed(Roles.Admin)
  @UseGuards(RolesGuard)
  @Get()
  public getTeam(@Param('restaurantId') id: string): Promise<TTeamMember[]> {
    return this._teamService.getTeam(id);
  }
}
