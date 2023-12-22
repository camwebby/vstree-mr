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

export const discardIngressEvent = async (ingressEvent: IngressEvent) => {
  await db.ingressEvent.delete({
    where: {
      id: ingressEvent.id,
    },
  });
};

export const validatePayloadHasAllKeys = (ingressEvent: IngressEvent) => {
  const payload = JSON.parse(ingressEvent.payload?.toString() || "{}");
  const modelName = modelMap[ingressEvent.model as 1 | 2];

  const payloadKeysArr = Object.keys(payload);
  const modelKeysArr = Object.keys(db[modelName].fields);

  const isValid = payloadKeysArr.every((key) => modelKeysArr.includes(key));

  if (!isValid) {
    return;
  }

  return payload;
};
