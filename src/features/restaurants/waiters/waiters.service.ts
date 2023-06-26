import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { concatMap, delay, first } from 'rxjs';

import { generateRandomNumberCode } from '@shared/helper';
import { IDeletedEntity, IStatusResponse } from '@shared/interfaces';

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

  public async delete(id: string): Promise<IDeletedEntity> {
    await this._waiterRepository.destroy({
      where: { id }
    });
    return { id };
  }

  public async getWaiters(restaurantId: string): Promise<Waiter[]> {
    return this._waiterRepository.findAll({
      where: { restaurantId }
    });
  }

  public async confirm(
    confirmationCode: number,
    messengerUserId: string,
    messengerType: TMessengerType
  ): Promise<IStatusResponse> {
    console.log('WaitersService confirm input', {
      confirmationCode,
      messengerUserId,
      messengerType
    });
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

  public getAuthorizedWaiter(messengerUserId: string): Promise<Waiter | null> {
    return this._waiterRepository.findOne({
      where: { messengerUserId }
    });
  }

  public async sendNotifications(
    restaurantId: string,
    tableName: string,
    guestName: string
  ): Promise<IStatusResponse> {
    const waiters = await this._waiterRepository.findAll({ where: { restaurantId } });
    const telegramBotToken = this._configService.get('TELEGRAM_BOT_TOKEN');

    for (const waiter of waiters) {
      const accountIsConfirmed = !!waiter.messengerUserId;
      if (waiter.isWorking && accountIsConfirmed) {
        this._httpService
          .post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            chat_id: waiter.messengerUserId,
            text: `__________________________________\n\n🛎Стіл: ${tableName}🛎`
          })
          .pipe(
            delay(1000),
            concatMap(() =>
              this._httpService
                .post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
                  chat_id: waiter.messengerUserId,
                  text: `🕺💃 Гість ${guestName} очікуває вас 🕒`
                })
                .pipe(
                  delay(1000),
                  concatMap(() =>
                    this._httpService.post(
                      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
                      {
                        chat_id: waiter.messengerUserId,
                        text: `Поспішіть 🏃`
                      }
                    )
                  )
                )
            ),
            first()
          )
          .subscribe();
      }
    }

    return { success: true };
  }

  public async changeIsWorkingStatus(
    messengerUserId: string,
    isWorking: boolean
  ): Promise<IStatusResponse> {
    await this._waiterRepository.update({ isWorking }, { where: { messengerUserId } });

    return { success: true };
  }
}
