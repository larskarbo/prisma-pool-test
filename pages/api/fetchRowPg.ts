import { isArray } from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import { nameToFetch } from "../../lib/constant";
import { pgPool } from "../../lib/pg";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const resultPosts = await pgPool.query(
    `
    SELECT "public"."User"."id", "public"."User"."email", "public"."User"."name" 
    FROM "public"."User"
    WHERE "public"."User"."name" ='${nameToFetch}'
    LIMIT ${1} OFFSET ${0}
    `,
  );
  res.json(resultPosts.rows[0]);
}
