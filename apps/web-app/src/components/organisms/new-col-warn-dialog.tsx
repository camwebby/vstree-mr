import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "vst-ui";
import { Button } from "vst-ui";
import { useContext, useState } from "react";
import { NewCollectionContext } from "@/contexts/new-collection";

const NewColWarnDialog = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { form, setMinimized } = useContext(NewCollectionContext);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure absolutely sure?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This will reset all the changes you made to the form.
        </DialogDescription>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              form.reset(
                {
                  collectionName: undefined,
                },
                { keepValues: false },
              );
              onOpenChange(false);
              form.setValue("vsts", []);
              setMinimized(false);
            }}
          >
            Reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewColWarnDialog;
