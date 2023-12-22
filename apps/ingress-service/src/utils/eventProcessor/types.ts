import { IngressEvent } from "vst-database";
import { SCRAPE_SUPPORTED_DOMAINS } from "../../consts/supportedDomains";
import { ScrapeErr } from "../types";

export type DomainXpatchSchemaMap = Record<
  (typeof SCRAPE_SUPPORTED_DOMAINS)[number],
  Record<string, string>
>;

export interface IngressEventProcessor {
  _platformModelXpathFieldMap: DomainXpatchSchemaMap;
  _mandatoryXpathFields: (keyof DomainXpatchSchemaMap[keyof DomainXpatchSchemaMap])[];

  _preScrapeValidatePayload(ingressEvent: IngressEvent): Promise<ScrapeErr>;
  process(ingressEvent: IngressEvent): Promise<ScrapeErr>;
}
