import {
  Controller,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { EmailExistsDto } from './dto/email-exist.dto';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(ValidationPipe)
  @Get('email-exists/:email')
  public async checkEmailExists(
    @Param() { email }: EmailExistsDto,
  ): Promise<{ exists: boolean }> {
    const exists = await this.userService.checkEmailExists(email);
    return { exists };
  }
}
