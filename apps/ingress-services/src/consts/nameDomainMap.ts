import { SCRAPE_SUPPORTED_DOMAINS } from "./supportedDomains.js";

export const nameDomainMap: Record<
  Partial<(typeof SCRAPE_SUPPORTED_DOMAINS)[number]>,
  string
> = {
  "valhalladsp.com": "Valhalla official",
  "pluginboutique.com": `Plugin Boutique`,
  "adsrsounds.com": "ADSR Sounds",
  "producerspot.com": "Producer Spot",
  "kvraudio.com": "KVR Audio",
  "gear4music.com": "Gear4Music",
} as const;
