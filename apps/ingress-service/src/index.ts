import { db } from "./lib/db";
import { __CONFIG__ } from "./consts/config";
import { createProcessor } from "./utils/eventProcessor";
import {
  discardIngressEvent,
  markIngressEventAsChecked,
  markIngressEventAsSuccess,
} from "./utils/eventProcessor/utils";

export const main = async () => {
  console.log(`Starting ingress service run`);

  // retrieve unverified vsts
  const events = await db.ingressEvent.findMany({
    where: {
      // lastCheckedAt: {
      //   lt: new Date(),
      // },
    },
  });

  console.log(`Found ${events.length} events to process`);

  // scrapes
  for (const ingressEvent of events) {
    if (ingressEvent.checkCount > __CONFIG__.MAX_VERIFICATIONS) {
      await discardIngressEvent(ingressEvent);
    }

    const processor = createProcessor(ingressEvent);

    const err = await processor.process(ingressEvent);

    if (!!err && err.handleAction === "retry") {
      await markIngressEventAsChecked(ingressEvent);
    }
    if (!!err && err.handleAction === "discard") {
      console.error(err.errMessage);
      await discardIngressEvent(ingressEvent);
    }

    await markIngressEventAsSuccess(ingressEvent);
  }

  console.log(`Finished ingress service run`);
};

await main();
