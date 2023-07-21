import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Zone } from './zones.model';
import { Waiter } from '../waiters/waiters.model';

interface ZoneWaiterCreationAttr {
  zoneId: string;
  waiterId: string;
}

@Table({ tableName: 'zone_waiter', createdAt: false, updatedAt: false })
export class ZoneWaiter
  extends Model<ZoneWaiter, ZoneWaiterCreationAttr>
  implements ZoneWaiterCreationAttr
{
  @ForeignKey(() => Zone)
  @Column({ type: DataType.UUID, field: 'zone_id' })
  zoneId: string;

  @ForeignKey(() => Waiter)
  @Column({ type: DataType.UUID, field: 'waiter_id' })
  waiterId: string;

  @BelongsTo(() => Zone, { foreignKey: 'zone_id', onDelete: 'CASCADE' })
  zone: Zone;

  @BelongsTo(() => Waiter, { foreignKey: 'waiter_id', onDelete: 'CASCADE' })
  waiter: Waiter;
}
