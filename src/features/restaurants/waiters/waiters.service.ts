import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { firstValueFrom } from 'rxjs';

import { generateRandomNumberCode } from '@shared/helper';
import { IStatusResponse } from '@shared/interfaces';

import { TMessengerType } from './waiters.interfaces';
import { Waiter } from './waiters.model';

@Injectable()
export class WaitersService {
  constructor(
    @InjectModel(Waiter) private _waiterRepository: typeof Waiter,
    private readonly _httpService: HttpService,
    private readonly _configService: ConfigService
  ) {}

  public async create(name: string, restaurantId: string): Promise<Waiter> {
    return this._waiterRepository.create({
      name,
      confirmationCode: generateRandomNumberCode(6),
      restaurantId
    });
  }

  public async confirm(
    confirmationCode: string,
    messengerUserId: string,
    messengerType: TMessengerType
  ): Promise<IStatusResponse> {
    const waiter = await this._waiterRepository.findOne({ where: { confirmationCode } });

    if (!waiter) {
      throw new NotFoundException('Confirmation Code is invalid');
    }

    await this._waiterRepository.update(
      {
        confirmationCode: null,
        messengerType,
        messengerUserId
      },
      { where: { confirmationCode } }
    );
    return { success: true };
  }

  public async IsAuthorized(messengerUserId: string): Promise<boolean> {
    const user = await this._waiterRepository.findOne({
      where: { messengerUserId, confirmationCode: null }
    });

    return !!user;
  }

  public async sendNotifications(
    restaurantId: string,
    tableName: string,
    guestName: string
  ): Promise<IStatusResponse> {
    const waiters = await this._waiterRepository.findAll({ where: { restaurantId } });
    const telegramBotToken = this._configService.get('TELEGRAM_BOT_TOKEN');

    for (const waiter of waiters) {
      await firstValueFrom(
        this._httpService.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          chat_id: waiter.messengerUserId,
          text: `Гість ${guestName} з столу ${tableName} очікуває вас`
        })
      );
    }

    return { success: true };
  }
}
