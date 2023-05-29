import { Body, Controller, Get, NotFoundException, Param, Post, Req } from '@nestjs/common';

import { SkipAuthGuard } from '@core/auth/decorators';
import { IAuthRequest } from '@core/auth/interfaces';

import { CreateUserDto } from './dto/create-user.dto';
import { EmailExistsDto } from './dto/email-exist.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @SkipAuthGuard()
  @Get('email-exists/:email')
  public async checkEmailExists(
    @Param() emailExistsDto: EmailExistsDto
  ): Promise<{ isExist: boolean }> {
    const isExist = await this._usersService.checkEmailExists(emailExistsDto.email);
    return { isExist };
  }

  @Post()
  public async create(@Body() userDto: CreateUserDto): Promise<CreateUserDto> {
    return this._usersService.createUser(userDto);
  }

  @Get('self')
  public async getUserByCognitoId(@Req() request: IAuthRequest): Promise<CreateUserDto | null> {
    const user = await this._usersService.getUserByCognitoId(request.user.idUser);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get(':id')
  public async getUser(@Param('id') id: string): Promise<CreateUserDto | null> {
    const user = await this._usersService.getUser(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
