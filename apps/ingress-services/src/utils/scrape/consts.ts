import { SCRAPE_SUPPORTED_DOMAINS } from "../../consts/supportedDomains.js";
import { priceXPathMap } from "../../consts/xPathMaps.js";
import { xpathScrapeCallback } from "./callbacks.js";
import { ScrapeCallback } from "./types.js";

export const scrapeCallbackMap: Record<
  (typeof SCRAPE_SUPPORTED_DOMAINS)[number],
  ScrapeCallback<string>
> = {
  "valhalladsp.com": xpathScrapeCallback(priceXPathMap["valhalladsp.com"]),
  "pluginboutique.com": xpathScrapeCallback(
    priceXPathMap["pluginboutique.com"]
  ),
  "gear4music.com": xpathScrapeCallback(priceXPathMap["gear4music.com"]),
  "kvraudio.com": xpathScrapeCallback(priceXPathMap["kvraudio.com"]),
  "producerspot.com": xpathScrapeCallback(priceXPathMap["producerspot.com"]),
  "adsrsounds.com": xpathScrapeCallback(priceXPathMap["adsrsounds.com"]),
};
