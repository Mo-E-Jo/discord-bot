const { Pool } = require("pg");

module.exports = new Pool({
  user: "postgres", // Your PostgreSQL username
  host: "localhost", // PostgreSQL host
  database: "postgres", // Database name
  password: "postgres", // PostgreSQL password
  port: 5432, // Default PostgreSQL port
});
