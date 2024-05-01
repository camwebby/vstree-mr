import type { UserVstAssociation } from "vst-database";
import { z } from "zod";
import { zUserVstCountStats } from "@/constants/zod/vst-count-stats";
import { db } from "@/server/db";
import { vstToggleToCount } from "@/constants/vst-user-action";

export const vstCountIncrement = async (
  payload: UserVstAssociation,
  field: z.infer<typeof zUserVstCountStats>,
) => {
  let data;

  if (payload[field]) {
    data = {
      [vstToggleToCount[field]]: {
        increment: 1,
      },
    };
  } else {
    data = {
      [vstToggleToCount[field]]: {
        decrement: 1,
      },
    };
  }

  try {
    await db.vst.update({
      where: {
        id: payload.vstId,
      },
      data,
    });
  } catch (err) {
    throw new Error(`
      Error updating vst count for ${field}`);
  }
};
