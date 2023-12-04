import { WhereToFind } from "@prisma/client";
import { db } from "../lib/db.js";

export const validateVstName = (wtf: WhereToFind) => {
  const vst = db.vst.findUnique({
    where: {
      id: wtf.vstId,
    },
  });
};
