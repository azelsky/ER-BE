import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

import { IZoneCreationAttr } from './zones.model';
import { RTable } from '../tables/tables.model';
import { Waiter } from '../waiters/waiters.model';

class WaiterDto implements Partial<Waiter> {
  @IsNotEmpty()
  id: string;
}

class TableDto implements Partial<RTable> {
  @IsNotEmpty()
  id: string;
}

export class CreateUpdateZoneDto implements Omit<IZoneCreationAttr, 'restaurantId'> {
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WaiterDto)
  waiters: Waiter[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TableDto)
  tables: RTable[];
}
