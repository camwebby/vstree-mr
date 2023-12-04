import { currencyMap } from "./consts/currency.js";
import { nameDomainMap } from "./consts/nameDomainMap.js";
import { nameXPathMap, priceXPathMap } from "./consts/xPathMaps.js";
import { db } from "./lib/db.js";
import { logger } from "./lib/logger.js";
import { canEvaluateWTF } from "./utils/canEval.js";
import { getProcessables } from "./utils/getProcessables.js";
import { getRootDomain } from "./utils/getRootDomain.js";
import { parseMoney } from "./utils/parseMoney.js";
import { scrapeForData } from "./utils/scrape/index.js";

export const main = async () => {
  const wtfs = await getProcessables();

  if (!wtfs) {
    logger.log("info", "No processables found");
    return;
  }

  // Dispose of processables that have been verified too many times
  for (const wtf of wtfs) {
    logger.log("info", `Evaluting ${wtf.url}`);

    if (!canEvaluateWTF(wtf)) {
      // Set as deleted
      logger.log("info", `Setting as deleted ${wtf.url}`);

      await db.whereToFind.update({
        where: {
          id: wtf.id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    }
  }

  // Attempt scrape
  for (const wtf of wtfs) {
    logger.log("info", `-------------`);
    logger.log("info", `Scraping ${wtf.url}`);

    // Scrape
    try {
      const rootDomain = getRootDomain(wtf.url);
      if (!rootDomain) {
        continue;
      }

      const scrapedData = await scrapeForData(wtf, {
        price: priceXPathMap[rootDomain],
        name: nameXPathMap[rootDomain],
      });

      if (!scrapedData || !scrapedData?.price) {
        continue;
      }

      const parsedMoney = parseMoney(scrapedData.price);

      if (!parsedMoney.value) {
        continue;
      }

      // Update price
      logger.log(
        "info",
        `Updating price for ${wtf.url} at ${parsedMoney.value} `
      );

      const dbStoredCurrency = !!parsedMoney?.currency
        ? currencyMap[parsedMoney.currency]
        : undefined;

      await db.whereToFind.update({
        where: {
          id: wtf.id,
        },
        data: {
          vendorName: !!rootDomain ? nameDomainMap[rootDomain] : undefined,
          price: parsedMoney?.value * 100,
          currency: dbStoredCurrency,
        },
      });
    } catch {
      logger.log("info", `Failed to scrape ${wtf.url}`);
    } finally {
      logger.log("info", `Setting lastVerified ${wtf.url}`);

      // Set last verified at
      await db.whereToFind.update({
        where: {
          id: wtf.id,
        },
        data: {
          lastVerifiedAt: new Date(),
          verificationsWithoutPriceCount: {
            increment: 1,
          },
        },
      });
    }
  }

  logger.log("info", `Done`);
};

await main();
