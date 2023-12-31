import AWS, { S3 } from "aws-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { S3_FOLDER } from "./consts";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_S3,
  secretAccessKey: process.env.AWS_SECRET_KEY_S3,
});

const Endpoint = async (
  req: NextApiRequest,
  res: NextApiResponse<{
    uploadedFile?: AWS.S3.ManagedUpload.SendData;
    error?: string;
  }>,
) => {
  if (req.method === "POST") {
    //----------------------------------
    // VALIDATION
    //----------------------------------

    const { file, folder, mimeType } = req.body
      ? JSON.parse(req.body)
      : { file: "", folder: "", mimeType: "" };

    if (
      typeof file !== "string" ||
      typeof folder !== "string" ||
      typeof mimeType !== "string"
    ) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    // get extension from mime type
    const fileType = mimeType.split("/")[1];

    if (!fileType) {
      res.status(400).json({ error: "Invalid file type" });
      return;
    }
    // if (!(folder in Object.values(S3_FOLDER))) {
    //   res.status(400).json({ error: "Invalid folder" });
    //   return;
    // }
    if (!file) {
      res.status(400).json({ error: "No file" });
      return;
    }
    if (!mimeType) {
      res.status(400).json({ error: "No mime type" });
      return;
    }
    if (mimeType.split("/")[0] !== "image") {
      res.status(400).json({ error: "Invalid file type" });
      return;
    }

    //----------------------------------
    // PREPARE UPLOAD
    //----------------------------------

    // convert file to base64
    const buffer = Buffer.from(file, "base64");

    // gen guid with crypto
    const guid = crypto.randomUUID();

    const params = {
      Bucket: "vst-assets",
      Folder: S3_FOLDER.COLLECTION_ICONS,
      Key: `${S3_FOLDER[folder as keyof typeof S3_FOLDER]}/${guid}.${fileType}`,
      Body: buffer,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: mimeType,
    };

    try {
      const uploadedFile = await s3.upload(params).promise();
      res.status(200).json({ uploadedFile });
    } catch (error) {
      res.status(500).json({ error: error as string });
    }
  }
};

export default Endpoint;
