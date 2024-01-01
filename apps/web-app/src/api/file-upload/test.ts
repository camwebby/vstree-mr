import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { BLOB_FOLDERS } from "vst-utils";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_S3 ?? "",
    secretAccessKey: process.env.AWS_SECRET_KEY_S3 ?? "",
  },
});

const BUCKET_NAME = "vst-assets";

export const FileUploadApiRoute = async (
  req: NextApiRequest,
  res: NextApiResponse<{
    uploadedFileRes?: Pick<AWS.S3.ManagedUpload.SendData, "Location">;
    error?: string;
  }>,
) => {
  console.log({
    message: "Received request to upload file",
    timestamp: new Date().toISOString(),
    body: req.body,
  });

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
    if (
      !Object.values(BLOB_FOLDERS).includes(
        folder as (typeof BLOB_FOLDERS)[keyof typeof BLOB_FOLDERS],
      )
    ) {
      res.status(400).json({ error: "Invalid folder" });
      return;
    }
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
      Bucket: BUCKET_NAME,
      // Folder: folder,
      Key: `${folder}/${guid}.${fileType}`,
      Body: buffer,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: mimeType,
    } satisfies PutObjectCommandInput;

    try {
      console.log({
        message: "Attempting to upload file to s3",
        timestamp: new Date().toISOString(),
      });

      const s3Res = await s3.send(new PutObjectCommand(params));

      console.log({
        message: "Successfully uploaded file to s3",
        timestamp: new Date().toISOString(),
        body: s3Res,
      });

      const uploadedFileRes = {
        Location: `https://${BUCKET_NAME}.s3.amazonaws.com/${folder}/${guid}.${fileType}`,
      };

      res.status(200).json({ uploadedFileRes });
      return;
    } catch (error) {
      console.error({ error, timestamp: new Date().toISOString() });
      res.status(500).json({ error: "There was an error uploading" });
      return;
    }
  }

  res.status(405).json({ error: "Method not supported" });
};