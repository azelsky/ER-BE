import { Zone } from './zones.model';
import { RTable } from '../tables/tables.model';
import { Waiter } from '../waiters/waiters.model';

export interface IZone extends Pick<Zone, 'name' | 'id'> {
  waiters: Waiter[];
  tables: RTable[];
}
