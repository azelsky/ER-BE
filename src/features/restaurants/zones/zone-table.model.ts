import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Zone } from './zones.model';
import { RTable } from '../tables/tables.model';

interface ZoneTableCreationAttr {
  zoneId: string;
  tableId: string;
}

@Table({ tableName: 'zone_table', createdAt: false, updatedAt: false })
export class ZoneTable
  extends Model<ZoneTable, ZoneTableCreationAttr>
  implements ZoneTableCreationAttr
{
  @ForeignKey(() => Zone)
  @Column({ type: DataType.UUID, field: 'zone_id' })
  zoneId: string;

  @ForeignKey(() => RTable)
  @Column({ type: DataType.UUID, field: 'table_id' })
  tableId: string;

  @BelongsTo(() => Zone, { foreignKey: 'zone_id', onDelete: 'CASCADE' })
  zone: Zone;

  @BelongsTo(() => RTable, { foreignKey: 'table_id', onDelete: 'CASCADE' })
  table: RTable;
}
