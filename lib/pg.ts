import { isNumber, toNumber } from "lodash";
import { Pool, Client } from "pg";
import { connectionLimit } from "./constant";
// pools will use environment variables
// for connection information

console.log({
  connectionString: process.env.DATABASE_URL,
  max: connectionLimit,
});

export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: connectionLimit,
});
