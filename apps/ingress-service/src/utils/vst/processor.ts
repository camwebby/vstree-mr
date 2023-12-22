//@ts-nocheck
import { IngressEvent } from "vst-database";
import { scrapeByUrlAndXpathSchema } from "../scrape/xpathScrape";
import { getRootDomain } from "../getRootDomain";
import { validatePayloadHasAllKeys } from "../eventProcessor/utils";
import {
  DomainXpatchSchemaMap,
  IngressEventProcessor,
} from "../eventProcessor/types";
import { generateSlug } from "vst-utils";
import { db } from "../../lib/db";

export class VstProcessor implements IngressEventProcessor {
  platformModelXpathFieldMap: DomainXpatchSchemaMap = {
    "valhalladsp.com": {
      name: "Website Domain",
      tags: "Website Domain",
    },
    "adsrsounds.com": {},
    "gear4music.com": {},
    "pluginboutique.com": {},
    "producerspot.com": {},
    "kvraudio.com": {},
  };

  mandatoryFields = ["name"];

  async preScrapeValidatePayload(ingressEvent: IngressEvent) {
    const payload = validatePayloadHasAllKeys(ingressEvent);
    if (!payload) {
      throw new Error("Payload does not match model");
    }

    // validate mandatory fields are present in the xpatch schema
    const mandatoryFields = this.mandatoryFields;

    const payloadKeysArr = Object.keys(payload);

    const isValid = mandatoryFields.every((key) =>
      payloadKeysArr.includes(key)
    );

    if (!isValid) {
      throw new Error("Payload does not contain mandatory fields");
    }

    return {
      error: null,
    };
  }

  async preCreateValidatePayload(ingressEvent: IngressEvent) {
    return {
      error: null,
    };
  }

  public async process(ingressEvent: IngressEvent) {
    // validate payload
    const { error } = await this.preScrapeValidatePayload(ingressEvent);
    if (error) {
      return {
        error: error as Error,
      };
    }

    const domain = getRootDomain(ingressEvent.url);

    if (domain === null) {
      return {
        error: new Error("Invalid or unsupported domain"),
      };
    }

    const scrapeSchema = this.platformModelXpathFieldMap[domain];

    const data = await scrapeByUrlAndXpathSchema(
      ingressEvent.url,
      scrapeSchema
    );

    // validate payload
    const { error: preCreErr } =
      await this.preCreateValidatePayload(ingressEvent);
    if (preCreErr) {
      return {
        error: preCreErr as Error,
      };
    }

    // attempt to create record
    try {
      await db.vst.create({
        data: {
          name: data.name,
          slug: generateSlug(data.name),
          tags: [],
        },
      });
    } catch (error) {
      return {
        error: error as Error,
      };
    }

    return {
      error: null,
    };
  }
}
