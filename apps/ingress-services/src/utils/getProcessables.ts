import { LAST_VERIFICATION_MIN } from "../consts/index.js";
import { db } from "../lib/db.js";

export const getProcessables = async () => {
  const processables = await db?.whereToFind.findMany({
    where: {
      deletedAt: null,
      url: {
        not: undefined,
      },
      price: null,
      // must not be within last X days - can be null
      // lastVerifiedAt: {
      // lt: new Date(Date.now() - LAST_VERIFICATION_MIN),
      // before 7 days ago
      // },
    },
  });

  return processables;
};
