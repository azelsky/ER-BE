import { Body, Controller, Get, NotFoundException, Param, Post, Req } from '@nestjs/common';

import { SkipAuthGuard } from '@auth/decorators';
import { IAuthRequest } from '@auth/interfaces';

import { CreateUserDto } from './dto/create-user.dto';
import { EmailExistsDto } from './dto/email-exist.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @SkipAuthGuard()
  @Get('email-exists/:email')
  public async checkEmailExists(
    @Param() emailExistsDto: EmailExistsDto
  ): Promise<{ isExist: boolean }> {
    const isExist = await this._userService.checkEmailExists(emailExistsDto.email);
    return { isExist };
  }

  @Post()
  public async create(@Body() userDto: CreateUserDto): Promise<CreateUserDto> {
    return this._userService.createUser(userDto);
  }

  @Get(':id')
  public async getUser(@Param('id') id: string): Promise<CreateUserDto | null> {
    const user = await this._userService.getUser(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get()
  public async getUserByCognitoId(@Req() request: IAuthRequest): Promise<CreateUserDto | null> {
    const user = await this._userService.getUserByCognitoId(request.user.idUser);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
