import { IngressEvent } from "vst-database";
import { scrapeByUrlAndXpathSchema } from "../scrape/xpathScrape";
import { getRootDomain } from "../getRootDomain";
import { validatePayloadHasAllKeys } from "../eventProcessor/utils";
import {
  DomainXpatchSchemaMap,
  IngressEventProcessor,
} from "../eventProcessor/types";
import { ScrapeErr } from "../types";

export class GenericProcessor implements IngressEventProcessor {
  _platformModelXpathFieldMap: DomainXpatchSchemaMap;
  _mandatoryXpathFields: string[] = [];
  _createEntityFromEvent: (
    ingressEvent: IngressEvent,
    data: Record<string, string>
  ) => Promise<ScrapeErr>;

  constructor(
    platformModelXpathFieldMap: DomainXpatchSchemaMap,

    /**
     * Fields that are required to be in the xpath schema
     */
    mandatoryXpathFields: string[] = [],
    createEntityFromEvent: (
      ingressEvent: IngressEvent,
      data: Record<string, string>
    ) => Promise<ScrapeErr>
  ) {
    this._platformModelXpathFieldMap = platformModelXpathFieldMap;
    this._mandatoryXpathFields = mandatoryXpathFields;
    this._createEntityFromEvent = createEntityFromEvent;
  }

  async _preScrapeValidatePayload(
    ingressEvent: IngressEvent
  ): Promise<ScrapeErr> {
    const payload = validatePayloadHasAllKeys(ingressEvent);
    if (!payload) {
      return {
        errMessage: "Payload is missing mandatory fields",
        handleAction: "retry",
      };
    }

    // validate mandatory fields are present in the xpatch schema
    const mandatoryFields = this._mandatoryXpathFields;

    const payloadKeysArr = Object.keys(payload);

    const isValid = mandatoryFields.every((key) =>
      payloadKeysArr.includes(key)
    );

    if (!isValid) {
      return {
        errMessage: "Payload is missing mandatory fields",
        handleAction: "retry",
      };
    }
  }

  public async process(ingressEvent: IngressEvent): Promise<ScrapeErr> {
    // validate payload
    const error = await this._preScrapeValidatePayload(ingressEvent);
    if (!!error) {
      return error;
    }

    const domain = getRootDomain(ingressEvent.url);

    if (domain === null) {
      return {
        errMessage: "Invalid domain",
        handleAction: "retry",
      };
    }

    const scrapeSchema = this._platformModelXpathFieldMap[domain];

    const data = await scrapeByUrlAndXpathSchema(
      ingressEvent.url,
      scrapeSchema
    );

    // attempt to create record
    const err = await this._createEntityFromEvent(ingressEvent, data);

    return err;
  }
}
