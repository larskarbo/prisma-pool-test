import { isArray } from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import { pgPool } from "../../lib/pg";
import prisma from "../../lib/prisma";

// GET /api/getUser?name=:name
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query;

  if (isArray(name)) {
    throw new Error("name must be a string");
  }

  const resultPosts = await pgPool.query(
    `
  SELECT "public"."User"."id", "public"."User"."email", "public"."User"."name" FROM "public"."User" WHERE "public"."User"."name" = $1 LIMIT $2 OFFSET $3`,
    [name, 1, 0]
  );
  res.json({
    ...resultPosts.rows[0],
  });
  console.log('pgPool.totalCount: ', pgPool.totalCount);
}
