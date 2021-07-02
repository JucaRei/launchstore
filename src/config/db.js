// Pool não precisa ficar fazendo login toda hora nas query's.
const { Pool } = require("pg");

module.exports = new Pool({
  user: "postgres",
  password: "docker",
  host: "localhost",
  port: 5432,
  database: "launchstoredb",
});
