import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private _userRepository: typeof User) {}

  public async checkEmailExists(email: string): Promise<boolean> {
    return await this._userRepository.findOne({ where: { email } }).then(user => !!user);
  }

  public createUser(dto: CreateUserDto): Promise<CreateUserDto> {
    return this._userRepository.create(dto);
  }

  public getUser(id: string): Promise<CreateUserDto | null> {
    return this._userRepository.findOne({ where: { id } });
  }
}
