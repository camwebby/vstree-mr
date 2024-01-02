import { IngressEvent } from "vst-database";
import { db } from "../../lib/db";
import { modelMap } from "./consts";

export const markIngressEventAsChecked = async (ingressEvent: IngressEvent) => {
  await db.ingressEvent.update({
    where: {
      id: ingressEvent.id,
    },
    data: {
      lastCheckedAt: new Date(),
      checkCount: {
        increment: 1,
      },
    },
  });
};

export const markIngressEventAsSuccess = async (ingressEvent: IngressEvent) => {
  await db.ingressEvent.update({
    where: {
      id: ingressEvent.id,
    },
    data: {
      lastCheckedAt: new Date(),
      checkCount: {
        increment: 1,
      },
      lastSuccessAt: new Date(),
    },
  });
};

export const discardIngressEvent = async (ingressEvent: IngressEvent) => {
  await db.ingressEvent.delete({
    where: {
      id: ingressEvent.id,
    },
  });
};

export const validatePayloadHasAllKeys = (ingressEvent: IngressEvent) => {
  const payload = ingressEvent.payload?.valueOf() as object;
  const modelName = modelMap[ingressEvent.model as 1 | 2];
  const payloadKeysArr = Object.keys(payload);
  const modelKeysArr = Object.keys(db[modelName].fields);
  console.log({ modelKeysArr, payloadKeysArr });

  const isValid = payloadKeysArr.every((key) => modelKeysArr.includes(key));

  if (!isValid) {
    return;
  }

  return payload;
};

export const getEventsToProcess = async () => {
  const events = await db.ingressEvent.findMany({
    where: {
      // later than a day ago or never checked
      OR: [
        {
          lastCheckedAt: {
            lt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
          },
        },
        {
          lastCheckedAt: null,
        },
      ],
    },
  });

  return events;
};
