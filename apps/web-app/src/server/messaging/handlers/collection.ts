import { z } from "zod";
import type { UserCollectionAssociation } from "vst-database";
import { zUserCollectionCountStats } from "@/constants/zod/collection-count-stats";
import { db } from "@/server/db";

const countToToggle = {
  likesAt: "countLikes",
} as const;

export const collectionCountIncrement = async (
  payload: UserCollectionAssociation,
  field: z.infer<typeof zUserCollectionCountStats>,
) => {
  let data;

  if (payload[field]) {
    data = {
      [countToToggle[field]]: {
        increment: 1,
      },
    };
  } else {
    data = {
      [countToToggle[field]]: {
        decrement: 1,
      },
    };
  }

  try {
    await db.collection.update({
      where: {
        id: payload.collectionId,
      },
      data,
    });
  } catch (err) {
    throw new Error(`Error updating collection`);
  }
};
