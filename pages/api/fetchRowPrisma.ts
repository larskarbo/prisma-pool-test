import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { complexUserSelect } from "../../lib/query-testing/complexUserSelect";

export default async function test(_: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient({
    log: ["query"],
  });

  res.json(
    await prisma.user.findFirst({
      select: complexUserSelect,
      where: {
        email: "asdf",
      },
    })
  );
}
