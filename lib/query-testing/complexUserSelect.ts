import { Prisma } from "@prisma/client";

type CheckSelectKeys<T, U> = {
  [K in keyof T]: K extends keyof U ? T[K] : never;
};

export function createSelect<K>() {
  return <T extends K>(arg: CheckSelectKeys<T, K>) => arg;
}

export const complexUserSelect = createSelect<Prisma.UserSelect>()({
  id: true,
  email: true,
  name: true,
  Profile: {
    select: {
      bio: true,
    },
  },
  Comments: {
    select: {
      id: true,
      content: true,
      Likes: {
        select: {
          id: true,
        },
      },
    },
  },
});

export const getComplexUserSelect = ({
  shouldIncludeComments,
}: {
  shouldIncludeComments: boolean;
}) => {
  return {
    ...complexUserSelect,
    Comments: shouldIncludeComments ? complexUserSelect.Comments : undefined,
  };
};
