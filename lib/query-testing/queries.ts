import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { complexUserSelect, getComplexUserSelect } from "./complexUserSelect";

export default async function queries(_: NextApiRequest, res: NextApiResponse) {
  await prisma.user.findFirstOrThrow({
    select: {
      name: true,
      email: true,
      _count: {
        select: {
          Comments: true,
        },
      },
    },
    where: {
      id: 1000,
    },
  });

  const apiInput = {
    name: "John Doe", // can be any string
  };

  await prisma.user.findFirst({
    where: {
      name: apiInput.name,
    },
  });

  await prisma.user.findFirst({
    where: {
      quote: "Basic quote",
      slogan: "One dev to rule them all",
    },
  });

  await prisma.user.findFirst({
		select:{
			id: true,
		},
    where: {
      AND: [
        {
          quote: "Basic quote" as const,
        },
        {
          slogan: "One dev to rule them all",
        },
      ],
    },
  });

  await prisma.user.findFirst({
    include: {
      Comments: true,
    },
  });

  await prisma.user.findFirst({
    select: complexUserSelect,
  });

  await prisma.user.findFirst({
    select: getComplexUserSelect({
      shouldIncludeComments: Math.random() > 0.5,
    }),
  });

  // working
  await prisma.user.groupBy({
    by: ["name" as const],
  });

  // not working
  await prisma.user.groupBy({
    by: ["name"],
  });

  // problem: when nothing found it only does one query
  await prisma.user.findFirst({
    select: complexUserSelect,
    where: {
      email: "idonotexist@example.com",
    },
  });

  await prisma.$transaction(async (prisma) => {
    await prisma.user.findFirst({
      select: complexUserSelect,
      where: {},
    });
  });

  await prisma.user.deleteMany({
    where: {
      id: 1,
    },
  });

  res.json({});
}
