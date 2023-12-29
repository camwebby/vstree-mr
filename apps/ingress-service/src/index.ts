import { db } from "./lib/db";
import { __CONFIG__ } from "./consts/config";
import { createProcessor } from "./utils/eventProcessor";
import {
  discardIngressEvent,
  markIngressEventAsChecked,
} from "./utils/eventProcessor/utils";
import { logger } from "vst-utils";

export const main = async () => {
  // retrieve unverified vsts
  const events = await db.ingressEvent.findMany({
    where: {
      lastCheckedAt: {
        lt: new Date(),
      },
    },
  });

  // scrapes
  for (const ingressEvent of events) {
    if (ingressEvent.checkCount > __CONFIG__.MAX_VERIFICATIONS) {
      await discardIngressEvent(ingressEvent);
    }

    const processor = createProcessor(ingressEvent);

    const err = await processor.process(ingressEvent);

    if (!!err && err.handleAction === "retry") {
      console.error(err.errMessage);
      await markIngressEventAsChecked(ingressEvent);
    }
    if (!!err && err.handleAction === "discard") {
      console.error(err.errMessage);
      await discardIngressEvent(ingressEvent);
    }
  }
};
