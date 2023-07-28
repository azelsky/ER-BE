import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateOptions } from 'sequelize/types/model';

import { IAttributes } from '@shared/interfaces';

import { UpdateGuestPageDto } from './guest-pages.dto';
import { GuestPage } from './guest-pages.model';

@Injectable()
export class GuestPagesService {
  constructor(@InjectModel(GuestPage) private readonly _guestPageRepository: typeof GuestPage) {}

  public async create(restaurantId: string, options: CreateOptions = {}): Promise<GuestPage> {
    return await this._guestPageRepository.create({ restaurantId }, options);
  }

  public getGuestPage(restaurantId: string): Promise<GuestPage> {
    const exclude: IAttributes<GuestPage> = ['restaurantId'];

    return this._guestPageRepository.findOne({ where: { restaurantId }, attributes: { exclude } });
  }

  public async updateGuestPage(data: UpdateGuestPageDto, restaurantId: string): Promise<GuestPage> {
    const [rowCount] = await this._guestPageRepository.update(data, {
      where: { id: data.id }
    });

    if (rowCount === 0) {
      throw new NotFoundException('Guest Page not found');
    }

    return this.getGuestPage(restaurantId);
  }
}
