import { PrismaClient, Prisma } from "@prisma/client";
import { range } from "lodash";

const prisma = new PrismaClient();

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

  // Users
  const user1 = await prisma.user.create({
    data: {
      email: "john.doe@example.com",
      name: "John Doe",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "jane.doe@example.com",
      name: "Jane Doe",
    },
  });

  // Profiles
  await prisma.profile.create({
    data: {
      bio: "Software developer from California",
      userId: user1.id,
    },
  });

  await prisma.profile.create({
    data: {
      bio: "UX designer from New York",
      userId: user2.id,
    },
  });

  // Posts
  const post1 = await prisma.post.create({
    data: {
      title: "My first blog post",
      content: "This is the content of my first blog post.",
      authorId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "Another interesting blog post",
      content: "This is the content of another interesting blog post.",
      authorId: user2.id,
    },
  });

  // Comments
  const comment1 = await prisma.comment.create({
    data: {
      content: "Great post, thanks for sharing!",
      userId: user2.id,
      postId: post1.id,
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      content: "I found this post helpful, thank you!",
      userId: user1.id,
      postId: post2.id,
    },
  });

  // Likes
  await prisma.like.create({
    data: {
      userId: user1.id,
      commentId: comment1.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: user2.id,
      commentId: comment2.id,
    },
  });

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
