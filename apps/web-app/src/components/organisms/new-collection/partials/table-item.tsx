import { GripVertical, StickyNoteIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button, Input } from "vst-ui";
import { EffectIcon, InstrumentIcon } from "vst-ui/src/assets";
import { cn } from "vst-ui/src/lib/utils";

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
        {!!props?.vst?.isInstrument ? <InstrumentIcon /> : <EffectIcon />}
        <div className="w-full">{props.vst.name}</div>
        <div className="flex-grow"></div>
        <Button type="button" size={"icon"} variant={"ghost"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            onClick={() => setShowNote(!showNote)}
            className={twMerge(
              `size-5`,

              !!props.vst.note ? "rounded-md fill-primary text-secondary" : "",
            )}
          >
            <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
          </svg>
        </Button>
        <Button
          type="button"
          size={"icon"}
          variant={"ghost"}
          onClick={props.onDelete}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
              clip-rule="evenodd"
            />
          </svg>
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
