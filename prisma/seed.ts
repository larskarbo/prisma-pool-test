import { PrismaClient, Prisma } from "@prisma/client";
import { range } from "lodash";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  ...range(0, 100_000).map((i) => ({
    name: `Some One ${i}`,
    email: `someone${i}@prisma.io`,
  })),
];

export const truncateAll = async (prisma: PrismaClient) => {
  // from: https://www.prisma.io/docs/concepts/components/prisma-client/crud#deleting-all-data-with-raw-sql--truncate

  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  for (const { tablename } of tablenames) {
    if (tablename !== "_prisma_migrations") {
      try {
        await prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${tablename}" RESTART IDENTITY CASCADE;`
        );
      } catch (error) {
        console.log({ error });
      }
    }
  }
};

async function main() {
  await truncateAll(prisma);
  console.log(`Start seeding ...`);
  for (const user of userData) {
    await prisma.user.create({ data: user });
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
