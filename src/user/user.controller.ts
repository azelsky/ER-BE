import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { EmailExistsDto } from './dto/email-exist.dto';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @UsePipes(ValidationPipe)
  @Get('email-exists/:email')
  public async checkEmailExists(
    @Param() emailExistsDto: EmailExistsDto
  ): Promise<{ isExist: boolean }> {
    const isExist = await this._userService.checkEmailExists(emailExistsDto.email);
    return { isExist };
  }

  @UsePipes(ValidationPipe)
  @Post()
  public async create(@Body() userDto: CreateUserDto): Promise<CreateUserDto> {
    return this._userService.createUser(userDto);
  }

  @UsePipes(ValidationPipe)
  @Get(':id')
  public async getUser(@Param('id') id: string): Promise<CreateUserDto | null> {
    const user = await this._userService.getUser(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
