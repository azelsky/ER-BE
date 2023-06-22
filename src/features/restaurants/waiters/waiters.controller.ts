import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { Waiter } from '@features/restaurants/waiters/waiters.model';

import { IDeletedEntity } from '@shared/interfaces';

import { CreateWaiterDto } from './waiters.dto';
import { WaitersService } from './waiters.service';

@Controller('restaurants/:restaurantId/waiters')
export class WaitersController {
  constructor(private readonly _waitersService: WaitersService) {}

  @Post('create')
  public create(
    @Body() data: CreateWaiterDto,
    @Param('restaurantId') restaurantId: string
  ): Promise<Waiter> {
    return this._waitersService.create(data.name, restaurantId);
  }

  @Delete(':waiterId')
  public delete(@Param('waiterId') waiterId: string): Promise<IDeletedEntity> {
    return this._waitersService.delete(waiterId);
  }

  @Get()
  public get(@Param('restaurantId') restaurantId: string): Promise<Waiter[]> {
    return this._waitersService.getWaiters(restaurantId);
  }
}
