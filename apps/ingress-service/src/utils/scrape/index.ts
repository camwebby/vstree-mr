import puppeteer from "puppeteer";
import { Page } from "puppeteer";

/**
 *
 * @param url
 * @returns
 */
export const setupPage = async (url: string) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--no-zygote",
      "--deterministic-fetch",
      "--disable-features=IsolateOrigins",
      "--disable-site-isolation-trials",
    ],
  });
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForNetworkIdle();

  return { browser, page };
};

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
