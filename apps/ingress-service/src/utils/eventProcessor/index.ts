import { IngressEvent } from "vst-database";
import { IngressEventProcessor } from "./types";
import { GenericProcessor } from "./generic";
import { generateSlug } from "vst-utils";
import { db } from "../../lib/db";
import { parseMoney } from "../parseMoney";
import { getRootDomain } from "../getRootDomain";
import { nameDomainMap } from "../../consts/nameDomainMap";
import { modelIntMap } from "vst-database/consts";
import { fuzzy } from "fast-fuzzy";

export const createProcessor = (
  ingressEvent: IngressEvent
): IngressEventProcessor => {
  switch (ingressEvent.model) {
    case modelIntMap["whereToFind"]: {
      return new GenericProcessor(
        {
          "valhalladsp.com": {},
          "adsrsounds.com": {},
          "gear4music.com": {
            price: `/html/body/div[5]/div[2]/div[2]/div[1]/div/div[3]/div[1]/div/div[1]/span[1]/span[2]`,
            name: `/html/body/div[5]/div[2]/div[2]/div[1]/div/div[1]/div[1]/h1`,
          },
          "pluginboutique.com": {},
          "producerspot.com": {},
          "kvraudio.com": {},
        },
        ["vstId", "vendorName", "currency"],
        async (ingressEvent, data) => {
          console.log({
            message: "Processing event",
            ingressEvent,
            data,
          });

          if (!data) {
            return {
              errMessage: "No data returned from scrape",
              handleAction: "retry",
            };
          }

          const { vstId, currency } = ingressEvent.payload?.valueOf() as {
            vstId: number;
            currency: string;
          };

          const domain = getRootDomain(ingressEvent.url);

          if (!domain) {
            return {
              errMessage: "Could not parse domain",
              handleAction: "discard",
            };
          }

          const vendorName = nameDomainMap[domain];

          // Parse money
          const { price, name } = data;

          if (!price) {
            return {
              errMessage: "Scraped price was empty or not found",
              handleAction: "retry",
            };
          }

          const parsedPrice = parseMoney(price);

          if (!parsedPrice.value) {
            return {
              errMessage: "Could not parse price",
              handleAction: "retry",
            };
          }

          // Validate name
          if (!name) {
            return {
              errMessage: "Scraped name was empty or not found",
              handleAction: "retry",
            };
          }

          const vst = await db.vst.findUnique({
            where: {
              id: vstId,
            },
          });

          // Fuzzy name match
          if (fuzzy(name, vst?.name || "") < 0.33) {
            return {
              errMessage: "Event vst name does not match scraped name",
              handleAction: "discard",
            };
          }

          try {
            const upsert = await db.whereToFind.upsert({
              where: {
                vstId_vendorName_currency: {
                  vstId,
                  vendorName,
                  currency: parsedPrice.currency || currency,
                },
              },
              create: {
                vstId,
                price: parsedPrice.value * 100,
                url: ingressEvent.url,
                currency: parsedPrice.currency || currency,
                vendorName,
              },
              update: {
                price: parsedPrice.value * 100,
              },
            });

            console.info({
              message: "WhereToFind upsert successful",
              timestamp: new Date().toISOString(),
              body: upsert,
            });

            return;
          } catch (error) {
            console.error({ error });

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

          if (!name) {
            return {
              errMessage: "Scraped name was empty or not found",
              handleAction: "retry",
            };
          }

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
