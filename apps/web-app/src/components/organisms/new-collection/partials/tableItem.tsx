import { GripVertical, StickyNoteIcon, Trash2Icon } from "lucide-react";
import { Button, Input } from "vst-ui";
import { EffectIcon, InstrumentIcon } from "../../vst-card";
import { useState } from "react";
import { cn } from "@/lib/utils";

const TableItem: React.FC<{
  vst: {
    name: string;
    id: number;
    tempId: string;
    iconUrl?: string | undefined;
    note?: string | undefined;
    isInstrument?: boolean | undefined;
  };
  indexInTable: number;
  onNoteChange: (note: string) => void;
  onDelete: () => void;
}> = ({ ...props }) => {
  const [showNote, setShowNote] = useState(false);
  return (
    <>
      <div className="flex w-full items-center gap-x-3 font-medium">
        {props.vst.isInstrument ? <InstrumentIcon /> : <EffectIcon />}
        <div className="w-full">{props.vst.name}</div>
        <div className="flex-grow"></div>
        <Button type="button" size={"icon"} variant={"ghost"}>
          <StickyNoteIcon
            onClick={() => setShowNote(!showNote)}
            className={
              !!props.vst.note ? "rounded-md fill-primary text-secondary" : ""
            }
          />
        </Button>
        <Button
          type="button"
          size={"icon"}
          variant={"ghost"}
          onClick={props.onDelete}
        >
          <Trash2Icon />
        </Button>
        <GripVertical className="cursor-move" />
      </div>
      {showNote && (
        <Input
          className={cn("format zod form errors")}
          placeholder="Note"
          defaultValue={props.vst.note}
          onInput={(e) => {
            props.onNoteChange(e.currentTarget.value);
          }}
        ></Input>
      )}
    </>
  );
};

export default TableItem;
