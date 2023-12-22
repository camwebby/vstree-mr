import { SCRAPE_SUPPORTED_DOMAINS } from "../supportedDomains";

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
