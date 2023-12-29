import { IngressEvent } from "vst-database";
import { IngressEventProcessor } from "./types";
import { GenericProcessor } from "./generic";
import { generateSlug } from "vst-utils";
import { db } from "../../lib/db";
import { parseMoney } from "../parseMoney";
import { getRootDomain } from "../getRootDomain";
import { nameDomainMap } from "../../consts/nameDomainMap";
import { modelIntMap } from "vst-database/consts";

export const createProcessor = (
  ingressEvent: IngressEvent
): IngressEventProcessor => {
  switch (ingressEvent.model) {
    case modelIntMap["whereToFind"]: {
      return new GenericProcessor(
        {
          "valhalladsp.com": {},
          "adsrsounds.com": {},
          "gear4music.com": {},
          "pluginboutique.com": {},
          "producerspot.com": {},
          "kvraudio.com": {},
        },
        ["vstId", "vendorName", "currency"],
        async (ingressEvent, data) => {
          const { vstId, currency } = JSON.parse(
            ingressEvent.payload?.toString() || "{}"
          );

          const domain = getRootDomain(ingressEvent.url);

          if (!domain) {
            return {
              errMessage: "Could not parse domain",
              handleAction: "discard",
            };
          }

          const vendorName = nameDomainMap[domain];

          const { price, currency: scrapedCurr } = data;

          const parsedPrice = parseMoney(price);

          if (!parsedPrice) {
            return {
              errMessage: "Could not parse price",
              handleAction: "retry",
            };
          }

          try {
            await db.whereToFind.create({
              data: {
                vstId,
                price: parsedPrice.value,
                url: ingressEvent.url,
                currency: scrapedCurr || currency,
                vendorName,
              },
            });
          } catch {
            return {
              errMessage: "Could not create WhereToFind",
              handleAction: "retry",
            };
          }
        }
      );
    }
    // VST
    case modelIntMap["vst"]: {
      return new GenericProcessor(
        {
          "valhalladsp.com": {
            name: "Website Domain",
            tags: "Website Domain",
          },
          "adsrsounds.com": {},
          "gear4music.com": {},
          "pluginboutique.com": {},
          "producerspot.com": {},
          "kvraudio.com": {},
        },
        ["name"],
        async (ingressEvent, data) => {
          const { name } = data;

          const slug = generateSlug(name);

          // validate doesnt already exist
          const existingVst = await db.vst.findFirst({
            where: {
              slug,
            },
          });
          if (existingVst) {
            return {
              errMessage: "VST already exists",
              handleAction: "discard",
            };
          }

          try {
            await db.vst.create({
              data: {
                name,
                slug,
              },
            });
          } catch {
            return {
              errMessage: "Could not create VST",
              handleAction: "retry",
            };
          }
        }
      );
    }
    default: {
      throw new Error("Not implemented");
    }
  }
};
