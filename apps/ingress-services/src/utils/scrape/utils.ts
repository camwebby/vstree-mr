import puppeteer from "puppeteer";

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
