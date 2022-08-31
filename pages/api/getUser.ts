import { isArray } from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

// GET /api/getUser?name=:name
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query;
  console.log('name: ', name);

  if (isArray(name)) {
    throw new Error("name must be a string");
  }

  const resultPosts = await prisma.user.findFirst({
    where: {
      name: name,
    },
    include: {
      posts: true,
    }
  });
  res.json(resultPosts);
}
