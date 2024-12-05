const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables

const connectionString = process.env.DATABASE_URL || {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
};

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;