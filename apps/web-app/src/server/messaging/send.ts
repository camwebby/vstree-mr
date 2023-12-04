// // import { v4 as uuidv4 } from "uuid";
// import {
//   TMessageCallbackPayload,
//   messageTypeCallbackMap,
//   // queueUrl,
//   // sqs,
// } from "./consts";

import { Vst } from "@prisma/client";
import { messageTypeCallbackMap } from "./consts";

// export const sendMessagePostMVP = async <TMessage>(
//   message: TMessage,
//   messageType: keyof typeof messageTypeCallbackMap,
//   group?: string,
// ) => {
//   if (!(messageType in messageTypeCallbackMap)) {
//     throw new Error(`Invalid message type: ${messageType}`);
//   }

//   const messageProcessCallback = messageTypeCallbackMap[messageType];

//   if (!messageProcessCallback) {
//     throw new Error(`No callback for message type: ${messageType}`);
//   }

//   // const parsedData = JSON.parse(message);

//   await messageProcessCallback(message);

//   // const params: AWS.SQS.SendMessageRequest = {
//   //   MessageBody: JSON.stringify(message),
//   //   QueueUrl: queueUrl as string,
//   //   MessageGroupId: group || "vst",
//   //   MessageDeduplicationId: uuidv4(),
//   //   MessageAttributes: {
//   //     type: {
//   //       DataType: "String",
//   //       StringValue: messageType,
//   //     },
//   //   },
//   // };

//   // sqs.sendMessage(params, (err, data) => {
//   //   if (err) {
//   //     throw new Error("Error sending message");
//   //   } else {
//   //     return data;
//   //   }
//   // });

//   // return;
// };

// const messageCallbackMap = {
//   test: (data: Vst) => true,
//   test2: (data: number) => true,
// } as const;

export const sendMessage = <T extends keyof typeof messageTypeCallbackMap>(
  messageType: T,
  payload: Parameters<(typeof messageTypeCallbackMap)[T]>[0],
) => {
  const messageProcessCallback = messageTypeCallbackMap[messageType];

  if (!messageProcessCallback) {
    throw new Error(`No callback for message type: ${messageType}`);
  }
  
  //@ts-ignore
  //!TODO: fix this
  return messageProcessCallback(payload);
};
