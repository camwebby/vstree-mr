import AWS from "aws-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { BLOB_FOLDERS, BUCKET_NAME } from "vst-utils";
import { H } from "@highlight-run/next/server";

export const FileUploadApiRoute = async (
  req: NextApiRequest,
  res: NextApiResponse<{
    uploadedFileRes?: Pick<AWS.S3.ManagedUpload.SendData, "Location">;
    error?: string;
  }>,
) => {
  H.log(
    {
      message: "Received request to upload file",
      timestamp: new Date().toISOString(),
      body: req.body,
    },
    "info",
  );

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
      Folder: folder,
      Key: `${folder}/${guid}.${fileType}`,
      Body: buffer,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: mimeType,
    };

    try {
      H.log(
        {
          message: "Attempting to upload file to s3",
          timestamp: new Date().toISOString(),
        },
        "info",
      );

      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_S3,
        secretAccessKey: process.env.AWS_SECRET_KEY_S3,
        // signatureVersion: "v4",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_S3 ?? "",
          secretAccessKey: process.env.AWS_SECRET_KEY_S3 ?? "",
        },
      });

      const uploadedFile = await s3.upload(params).promise();

      H.log(
        {
          message: "Successfully uploaded file to s3",
          timestamp: new Date().toISOString(),
          body: uploadedFile,
        },
        "info",
      );

      const uploadedFileRes = {
        Location: uploadedFile.Location,
      };

      res.status(200).json({ uploadedFileRes });
      return;
    } catch (error) {
      H.log({ error, timestamp: new Date().toISOString() }, "error");
      res.status(500).json({ error: "There was an error uploading" });
      return;
    }
  }

  res.status(405).json({ error: "Method not supported" });
};
