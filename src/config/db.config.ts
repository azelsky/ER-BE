import { Pool } from 'pg';

export const pool = new Pool({
  user: process.env.NAME,
  password: process.env.PASSWORD,
  host: 'localhost',
  port: 5432,
  database: 're'
});
