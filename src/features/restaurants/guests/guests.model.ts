import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { RTable } from '../tables';

interface GuestCreationAttr {
  id: string;
  name: string;
}

@Table({ tableName: 'guests' })
export class Guest extends Model<Guest, GuestCreationAttr> {
  @Column({
    type: DataType.UUID,
    primaryKey: true
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: ((): string => {
      const currentDate = new Date();
      const currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
      return `Guest ${currentTime}`;
    })()
  })
  name: string;

  @ForeignKey(() => RTable)
  @Column({ type: DataType.UUID, allowNull: false, field: 'table_id' })
  tableId: string;

  @BelongsTo(() => RTable, { onDelete: 'CASCADE' })
  table: RTable;
}
