import React, { useCallback, useState } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { BLOB_FOLDERS } from "vst-utils";

export const DropzoneUpload = ({
  onSuccess,
  onError,
  folder,
  className,
  render,
  imagesOnly,
}: {
  /**
   * Callback to run when the file is uploaded
   * @param uploadedFile The uploaded file
   */
  onSuccess: (uploadedFile: string) => void;

  /**
   * Callback to run when there is an error uploading the file
   */
  onError?: (error?: Error) => void;

  /**
   * The folder to upload the file to in S3
   */
  folder: (typeof BLOB_FOLDERS)[keyof typeof BLOB_FOLDERS];

  /**
   * The className to apply to the dropzone
   */
  className?: string;

  /**
   * The render function to render the dropzone
   * @param lastUploadedFileSrc The last uploaded file src; will be empty if no file has been uploaded
   */
  render: (lastUploadedFileSrc?: string) => React.ReactNode;

  /**
   * Whether or not to only allow images
   * @default false
   * @note This is not enforced on the backend
   */
  imagesOnly?: boolean;
}) => {
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [lastUploadedFile, setLastUploadedFile] = useState("");

  const onDrop: <T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles[0]) return;

    //get file name
    const fileName = acceptedFiles[0].name;
    const mimeType = acceptedFiles[0].type;
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file as Blob);

    if (imagesOnly && !mimeType.startsWith("image/")) {
      !!onError &&
        onError(new Error("Only images are allowed. Please try again."));

      return;
    }

    reader.onabort = () => {
      !!onError &&
        onError(new Error("File reading was aborted. Please try again."));
    };

    reader.onerror = () => {
      !!onError &&
        onError(new Error("File reading has failed. Please try again."));
    };

    reader.onload = async () => {
      //serialize file
      const readerResult = reader.result;

      //convert to base64
      const base64 = btoa(
        new Uint8Array(readerResult as ArrayBufferLike).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      try {
        setFileUploadLoading(true);

        const res = await fetch(`/api/file-upload`, {
          method: "POST",
          body: JSON.stringify({
            file: base64,
            fileName,
            mimeType,
            folder,
          }),
        });

        const { uploadedFile } = (await res.json()) as {
          uploadedFile: { Location: string };
        };

        setLastUploadedFile(uploadedFile.Location);

        onSuccess(uploadedFile.Location);
      } catch (error) {
        !!onError && onError();
      } finally {
        setFileUploadLoading(false);
      }
    };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={cn(className)} {...getRootProps()}>
      <input {...getInputProps()} />
      {fileUploadLoading ? (
        <p>Uploading...</p>
      ) : isDragActive ? (
        <div>Drop the files here ...</div>
      ) : (
        render(lastUploadedFile)
      )}
    </div>
  );
};
