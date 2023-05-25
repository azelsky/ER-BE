import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateOptions } from 'sequelize/types/model';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private _userRepository: typeof User) {}

  public async checkEmailExists(email: string): Promise<boolean> {
    return await this._userRepository.findOne({ where: { email } }).then(user => !!user);
  }

  public createUser(dto: CreateUserDto, options: CreateOptions = {}): Promise<User> {
    return this._userRepository.create(dto, options);
  }

  public getUser(id: string): Promise<User | null> {
    return this._userRepository.findOne({ where: { id } });
  }

  public getUserByCognitoId(cognitoId: string): Promise<User | null> {
    return this._userRepository.findOne({
      where: { cognitoId },
      attributes: { exclude: ['cognitoId', 'createdAt', 'updatedAt'] }
    });
  }

  public getUserByEmail(email: string): Promise<User | null> {
    return this._userRepository.findOne({
      where: { email },
      attributes: { exclude: ['cognitoId', 'createdAt', 'updatedAt'] }
    });
  }
}
