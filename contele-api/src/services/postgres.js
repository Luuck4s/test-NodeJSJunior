require("dotenv").config();
const Pool = require("pg").Pool;

const db = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: "localhost",
  port: 5432,
  database: "contele"
});

module.exports = db;
