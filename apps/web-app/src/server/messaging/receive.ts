// Post mvp
// import { messageTypeCallbackMap, queueUrl, sqs } from "./consts";

// export async function processMessage(message: AWS.SQS.Message) {
//   if (message.Body) {
//     logger.log("Received message:", { message });
//   } else {
//     throw new Error("Message body is empty");
//   }

//   const messageType = message?.MessageAttributes?.type?.StringValue as string;

//   if (!(messageType in messageTypeCallbackMap)) {
//     throw new Error(`Invalid message type: ${messageType}`);
//   }

//   const messageProcessCallback = messageTypeCallbackMap[messageType];

//   if (!messageProcessCallback) {
//     throw new Error(`No callback for message type: ${messageType}`);
//   }

//   const parsedData = JSON.parse(message.Body as string);

//   await messageProcessCallback(parsedData);
// }

// export function pollMessages(): void {
  
//   const params: AWS.SQS.ReceiveMessageRequest = {
//     QueueUrl: queueUrl as string,
//     MaxNumberOfMessages: 10,
//     VisibilityTimeout: 60,
//     WaitTimeSeconds: 20,
//     MessageAttributeNames: ["type"],
//   };

//   sqs.receiveMessage(params, (err, data) => {
//     if (err) {
//       console.error("Error receiving messages:", err);
//     } else {
//       if (data.Messages) {
//         data.Messages.forEach(async (message) => {
//           try {
//             await processMessage(message);

//             // Delete the message after processing
//             if (message.ReceiptHandle) {
//               const deleteParams: AWS.SQS.DeleteMessageRequest = {
//                 QueueUrl: queueUrl as string,
//                 ReceiptHandle: message.ReceiptHandle,
//               };
//               sqs.deleteMessage(deleteParams, (err) => {
//                 if (err) {
//                   console.error("Error deleting message:", err);
//                 } else {
//                   logger.log("Message deleted successfully");
//                 }
//               });
//             }
//           } catch (err) {
//             console.error("Error processing message:", err);

//             // retry 3 times
//             if (message.Attributes?.ApproximateReceiveCount) {
//               const receiveCount = parseInt(
//                 message.Attributes?.ApproximateReceiveCount || "0",
//               );

//               if (receiveCount >= 3) {
//                 console.error("Message failed to process after 3 retries");

//                 // move to DLQ depending on error reason TBI
//                 const dlqParams: AWS.SQS.SendMessageRequest = {
//                   MessageBody: message.Body as string,
//                   QueueUrl: queueUrl as string,
//                   MessageGroupId: "vst",

//                   MessageAttributes: {
//                     type: {
//                       DataType: "String",
//                       StringValue: "dlq",
//                     },
//                   },
//                 };

//                 sqs.sendMessage(dlqParams, (err, data) => {
//                   if (err) {
//                     console.error("Error sending message to DLQ:", err);
//                   } else {
//                     logger.log("Message sent to DLQ successfully");
//                   }
//                 });
//               }
//               return;
//             }
//             return;
//           }
//         });
//       }

//       // check if there are more messages to be received
//       if (data.Messages && data.Messages.length > 0) {
//         // Continue polling
//         pollMessages();
//       }

//       return;
//     }
//   });
// }
