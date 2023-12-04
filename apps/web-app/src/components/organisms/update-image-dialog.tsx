import { ComponentProps } from "react";
import { Dialog, DialogContent } from "vst-ui";
import {DropzoneUpload} from "vst-ui";
import { S3_FOLDER } from "@/pages/api/file-upload/consts";
import Image from "next/image";
import { toast } from "vst-ui";

const UpdateImageDialog = ({
  onSuccess,
  ...props
}: ComponentProps<typeof Dialog> & {
  onSuccess: (url: string) => void;
}) => {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DropzoneUpload
          className="top-0 my-5 cursor-pointer rounded-md border border-dashed border-border bg-background bg-opacity-100 p-3 text-sm text-zinc-600  duration-200 ease-in-out hover:border-primary  hover:bg-opacity-50"
          onSuccess={(url) => {
            onSuccess(url);
            toast({
              description: "Image uploaded successfully.",
            });
          }}
          onError={(error) => {
            toast({
              variant: "destructive",
              description:
                error?.message ||
                "There was an error uploading your image. Please try again.",
            });
          }}
          imagesOnly
          folder={S3_FOLDER.COLLECTION_ICONS}
          render={(fileSrc) =>
            !!fileSrc ? (
              <div className="flex flex-col items-center">
                <div className="relative h-20 w-20 overflow-hidden rounded-full">
                  <Image
                    alt="Uploaded image"
                    src={fileSrc}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <p className="mt-2">Change image</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <p>Upload image</p>
                <p className="text-xs text-muted-foreground">(Optional)</p>
              </div>
            )
          }
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateImageDialog;
