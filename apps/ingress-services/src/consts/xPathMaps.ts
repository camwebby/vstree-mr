import { SCRAPE_SUPPORTED_DOMAINS } from "./supportedDomains.js";

export const priceXPathMap: Record<
  Partial<(typeof SCRAPE_SUPPORTED_DOMAINS)[number]>,
  string
> = {
  "valhalladsp.com": "//*[@id='product-price-1']/span/span",
  "pluginboutique.com": `/html/body/div[2]/div[2]/div[5]/div[2]/div[3]/div[1]/div[5]/div/dl/dd`,
  "gear4music.com": `/html/body/div[5]/div[2]/div[2]/div[1]/div/div[3]/div[1]/div/div[1]/span[1]/span[2]`,
  "adsrsounds.com": `//*[@id="sinProdHeader"]/div/div[5]/div[2]/div[1]/a/span[1]/span[2]`,
  "kvraudio.com": ``,
  "producerspot.com": `//*[@id="col-1198968431"]/div/div[2]/div/p/ins/span/bdi`,
};

export const nameXPathMap: Record<
  Partial<(typeof SCRAPE_SUPPORTED_DOMAINS)[number]>,
  string
> = {
  "adsrsounds.com": `//*[@id="sinProdHeader"]/div/div[2]/div[1]/h1`,
  "gear4music.com": `/html/body/div[5]/div[2]/div[2]/div[1]/div/div[3]/div[1]/div/div[1]/h1`,
  "kvraudio.com": ``,
  "pluginboutique.com": ``,
  "valhalladsp.com": `//*[@id="product-title-1"]`,
  "producerspot.com": `//*[@id="col-1198968431"]/div/div[1]/div/h1`,
};
