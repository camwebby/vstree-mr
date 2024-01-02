import { __CONFIG__ } from "./consts/config";
import { createProcessor } from "./utils/eventProcessor";
import {
  discardIngressEvent,
  getEventsToProcess,
  markIngressEventAsChecked,
  markIngressEventAsSuccess,
} from "./utils/eventProcessor/utils";

export const main = async () => {
  console.log(`Starting ingress service run`);

  const events = await getEventsToProcess();

  console.log(`Found ${events.length} events to process`);

  // scrapes
  for (const ingressEvent of events) {
    if (
      ingressEvent.lastCheckedAt !== ingressEvent.lastSuccessAt &&
      ingressEvent.checkCount > __CONFIG__.MAX_VERIFICATIONS
    ) {
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

    // If success
    if (!err) {
      await markIngressEventAsSuccess(ingressEvent);
    }
  }

  console.log(`Finished ingress service run`);
};

await main();
