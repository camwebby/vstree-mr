import { Fragment, useEffect, useMemo, useState } from "react";
import { TableCell } from "vst-ui";
import { Input } from "vst-ui";
import VSTAvatar from "../../vst-avatar";
import Link from "next/link";
import { CollectionVst, Vst, UserVstAssociation } from "@prisma/client";
import { api } from "@/utils/api";
import { LibraryIcon, Trash } from "lucide-react";
import { toast } from "vst-ui";
import { useDebouncedValue } from "@mantine/hooks";
import { cn } from "vst-ui/src/lib/utils";
import dynamic from "next/dynamic";
import { SkeletonCard } from "../../skeleton-card";
import { vstStatIconMap, vstUserAction } from "@/constants/vstUserAction";

const VSTHoverCard = dynamic(() => import("../../vst-hover-card"), {
  ssr: false,
  loading: () => <SkeletonCard />,
});

export const ColVstRowItem: React.FC<{
  colVst: CollectionVst & {
    vst: Vst;
  };
  index: number;
  belongsToSessionUser: boolean;
  editMode?: boolean;
  collectionVsts: (CollectionVst & {
    vst: Vst;
  })[];
  onDelete: () => void;
  onSwap: ({
    selectedIndex,
    adjacentIndex,
  }: {
    selectedIndex: number;
    adjacentIndex: number;
  }) => void;
  disableActions?: boolean;
  userVst?: UserVstAssociation;
  showAssociations: (typeof vstUserAction)[keyof typeof vstUserAction][];
}> = ({ ...props }) => {
  const apiContext = api.useContext();

  const { mutate, isLoading: isUpdating } =
    api.collectionVst.updateCollectionVst.useMutation({
      onSuccess: async (data) => {
        await apiContext.collectionVst.getByCollectionId.invalidate({
          collectionId: data.collectionId,
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const [note, setNote] = useState(props.colVst?.note || "");

  const [debouncedNote] = useDebouncedValue(note, 600);

  useEffect(() => {
    if (debouncedNote !== props.colVst?.note) {
      mutate({
        collectionVstId: props.colVst.id,
        note: debouncedNote,
        collectionId: props.colVst.collectionId,
        order: props.colVst.order,
      });
    }
  }, [debouncedNote]);

  return (
    <>
      <TableCell className="text-muted-foreground">{props.index + 1}</TableCell>
      <TableCell className="flex flex-row items-center gap-x-3">
        <Link href={`/vsts/${props.colVst?.vst.slug}`}>
          <VSTHoverCard vstSlug={props.colVst.vst.slug}>
            <VSTAvatar item={props.colVst.vst} />
            {props.colVst?.vst.name}
          </VSTHoverCard>
        </Link>
      </TableCell>
      <TableCell>
        <Input
          onChange={(e) => {
            setNote(e.target.value);
          }}
          disabled={!props.belongsToSessionUser || !props.editMode}
          className={cn(
            props.editMode
              ? "ring-2 ring-primary/10"
              : "border-none disabled:cursor-default",
          )}
          type="text"
          value={note || ""}
        />
      </TableCell>

      {!!props.showAssociations?.length && (
        <TableCell className="flex flex-row items-center gap-x-3">
          {props.showAssociations.map((a, index) =>
            props.userVst?.[a] ? (
              <Fragment key={a + "_icon_" + props.colVst.id + "_" + index}>
                vstStatIconMap[a].checked
              </Fragment>
            ) : (
              <></>
            ),
          )}
        </TableCell>
      )}

      {props.editMode && props.belongsToSessionUser && (
        <>
          <TableCell className="">
            <button
              className="disabled:opacity-20"
              onClick={props.onDelete}
              disabled={!props.belongsToSessionUser || props.disableActions}
            >
              <Trash className="h-4 w-4" />
            </button>
          </TableCell>
          <TableCell className="cursor-grab">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 39 39"
              width="16"
              height="16"
            >
              <path
                d="M 5 0 C 7.761 0 10 2.239 10 5 C 10 7.761 7.761 10 5 10 C 2.239 10 0 7.761 0 5 C 0 2.239 2.239 0 5 0 Z"
                fill="#CCC"
              ></path>
              <path
                d="M 19 0 C 21.761 0 24 2.239 24 5 C 24 7.761 21.761 10 19 10 C 16.239 10 14 7.761 14 5 C 14 2.239 16.239 0 19 0 Z"
                fill="#CCC"
              ></path>
              <path
                d="M 33 0 C 35.761 0 38 2.239 38 5 C 38 7.761 35.761 10 33 10 C 30.239 10 28 7.761 28 5 C 28 2.239 30.239 0 33 0 Z"
                fill="#CCC"
              ></path>
              <path
                d="M 33 14 C 35.761 14 38 16.239 38 19 C 38 21.761 35.761 24 33 24 C 30.239 24 28 21.761 28 19 C 28 16.239 30.239 14 33 14 Z"
                fill="#CCC"
              ></path>
              <path
                d="M 19 14 C 21.761 14 24 16.239 24 19 C 24 21.761 21.761 24 19 24 C 16.239 24 14 21.761 14 19 C 14 16.239 16.239 14 19 14 Z"
                fill="#CCC"
              ></path>
              <path
                d="M 5 14 C 7.761 14 10 16.239 10 19 C 10 21.761 7.761 24 5 24 C 2.239 24 0 21.761 0 19 C 0 16.239 2.239 14 5 14 Z"
                fill="#CCC"
              ></path>
              <path
                d="M 5 28 C 7.761 28 10 30.239 10 33 C 10 35.761 7.761 38 5 38 C 2.239 38 0 35.761 0 33 C 0 30.239 2.239 28 5 28 Z"
                fill="#CCC"
              ></path>
              <path
                d="M 19 28 C 21.761 28 24 30.239 24 33 C 24 35.761 21.761 38 19 38 C 16.239 38 14 35.761 14 33 C 14 30.239 16.239 28 19 28 Z"
                fill="#CCC"
              ></path>
              <path
                d="M 33 28 C 35.761 28 38 30.239 38 33 C 38 35.761 35.761 38 33 38 C 30.239 38 28 35.761 28 33 C 28 30.239 30.239 28 33 28 Z"
                fill="#CCC"
              ></path>
            </svg>
          </TableCell>
        </>
      )}
    </>
  );
};
