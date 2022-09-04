import type { NextApiRequest, NextApiResponse } from "next";
import { Pool, Client } from "pg";

export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
});

const collect = async () => {
  const yo = await pgPool.query(
    `SELECT count(*) from pg_catalog.pg_stat_activity WHERE ("backend_type" = 'client backend');`
  );
};

setInterval(collect, 100);
