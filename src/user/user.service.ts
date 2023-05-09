import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from './users.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  public async checkEmailExists(email: string): Promise<boolean> {
    return await this.userRepository
      .findOne({ where: { email } })
      .then((user) => !!user);
  }
}
