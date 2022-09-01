import { Pool, Client } from "pg";
// pools will use environment variables
// for connection information
export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL_PG,
  max: 50,
});
