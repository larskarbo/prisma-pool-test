import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const name = "Some One 95000";

  const resultPosts = await prisma.user.findFirst({
    where: {
      name: name,
    },
  });

  res.json(resultPosts);
}
