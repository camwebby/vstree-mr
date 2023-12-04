import { WhereToFind } from "@prisma/client";
import { MAX_VERIFICATIONS_WITHOUT_PRICE } from "../consts/index.js";
import { getRootDomain } from "./getRootDomain.js";

export const canEvaluateWTF = (wtf: WhereToFind) => {
  if (wtf.verificationsWithoutPriceCount > MAX_VERIFICATIONS_WITHOUT_PRICE) {
    return false;
  }

  if (getRootDomain(wtf.url) === null) {
    return false;
  }

  return true;
};
