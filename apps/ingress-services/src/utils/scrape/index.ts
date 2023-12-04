import { WhereToFind } from "@prisma/client";
import { logger } from "../../lib/logger.js";
import { getRootDomain } from "../getRootDomain.js";
import { xpathScrapeCallbackObject } from "./callbacks.js";
import { scrapeCallbackMap } from "./consts.js";

export const scrapeForPrice = async (
  wtf: WhereToFind
): Promise<string | null> => {
  // extract root domain
  const domain = getRootDomain(wtf.url);

  if (domain === null) {
    return null;
  }

  // get callback
  const callback = scrapeCallbackMap[domain];

  try {
    const latestPrice = await callback(wtf);

    return latestPrice;
  } catch (error) {
    logger.log("error", {
      message: `Failed to scrape ${wtf.url}`,
      error,
    });
    return null;
  }
};

export const scrapeForData = async (
  wtf: WhereToFind,

  /**
   *
   * @example { price: `[id=123]`, name: `[id=832]` }
   *
   */
  xpathSchema: Record<string, string>
): Promise<Record<string, string> | null> => {
  // extract root domain
  const domain = getRootDomain(wtf.url);

  if (domain === null) {
    return null;
  }

  // get callback
  const callback = xpathScrapeCallbackObject(xpathSchema);

  try {
    const callbackRes = await callback(wtf);

    if (!callbackRes) {
      return null;
    }

    return callbackRes;
  } catch (error) {
    logger.log("error", {
      message: `Failed to scrape ${wtf.url}`,
      error,
    });
    return null;
  }
};
