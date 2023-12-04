import { SCRAPE_SUPPORTED_DOMAINS } from "../consts/supportedDomains.js";

export const getRootDomain = (
  url: string
): (typeof SCRAPE_SUPPORTED_DOMAINS)[number] | null => {
  try {
    const urlObj = new URL(url);

    return urlObj.hostname.replace(
      "www.",
      ""
    ) as (typeof SCRAPE_SUPPORTED_DOMAINS)[number];
  } catch {
    return null;
  }
};
