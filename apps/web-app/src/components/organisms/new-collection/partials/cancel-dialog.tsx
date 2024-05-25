import { memo } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "vst-ui";

const NewColCancelDialog = ({
  showWarnDialog,
  setShowWarnDialog,
  setShowNewCollectionForm,
  form,
  defaultFormValues,
}) => {
  return (
    <Dialog
      open={showWarnDialog}
      onOpenChange={(open) => {
        setShowWarnDialog(open);
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
              setShowWarnDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              form.reset(defaultFormValues, { keepValues: false });
              setShowNewCollectionForm(false);
              setShowWarnDialog(false);
            }}
          >
            Reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(NewColCancelDialog);
