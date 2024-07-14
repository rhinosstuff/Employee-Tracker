const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool(
  {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: process.env.DB_NAME,
},
  console.log(`\nConnected to the employee_tracker_db.\n`)
)

module.exports = pool;
