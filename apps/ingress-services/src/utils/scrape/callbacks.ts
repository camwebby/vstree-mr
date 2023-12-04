import { WhereToFind } from "@prisma/client";
import { Page } from "puppeteer";
import { ScrapeCallback } from "./types.js";
import { setupPage } from "./utils.js";

export const getTextContent = async (page: Page, xpath: string) => {
  const selector = await page.$x(xpath);

  if (!Array.isArray(selector) || !selector?.length) {
    return null;
  }

  // Get price
  const textContent = (await selector[0].evaluate(
    (node) => node.textContent
  )) as string;

  return textContent;
};

export const xpathScrapeCallback = (xpath: string): ScrapeCallback<string> => {
  const scrapeCallback: ScrapeCallback<string> = async (wtf: WhereToFind) => {
    const { browser, page } = await setupPage(wtf.url);

    const price = await getTextContent(page, xpath);

    if (!price) {
      return null;
    }

    await browser.close();

    return price;
  };

  return scrapeCallback;
};

/**
 *
 * @param fetchSchema - { [field_name]: [xpath] }
 * @returns {ScrapeCallback<Record<string, string>>} - { [field_name]: [value] }
 */
export const xpathScrapeCallbackObject = (
  fetchSchema: Record<string, string>
): ScrapeCallback<Record<string, string>> => {
  const scrapeCallback: ScrapeCallback<Record<string, string>> = async (
    wtf: WhereToFind
  ) => {
    const { browser, page } = await setupPage(wtf.url);

    const output: Record<string, string> = {};

    for (const [key, value] of Object.entries(fetchSchema)) {
      const textValue = await getTextContent(page, value);

      if (!value) {
        return null;
      }

      output[key] = textValue;
    }

    await browser.close();

    return output;
  };

  return scrapeCallback;
};
