const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'eventLogger',
  password: 'test',
  port: 5432,
});

module.exports = pool;
