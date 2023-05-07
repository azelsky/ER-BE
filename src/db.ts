import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.NAME,
    password: process.env.PASSWORD,
    host: 'localhost',
    port: 5432,
    database: 'test_res'
});

module.exports = pool;
