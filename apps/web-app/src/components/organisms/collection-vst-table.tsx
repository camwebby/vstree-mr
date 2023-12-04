import { Table, TableCell, TableHeader, TableRow } from "vst-ui";
import { useEffect, useMemo, useState } from "react";
import { Input } from "vst-ui";
import VSTAvatar from "./vst-avatar";
import Link from "next/link";
import { CollectionVst, Vst } from "@prisma/client";
import { api } from "@/utils/api";
import { Button } from "vst-ui";
import { VstSearchCommandMenu } from "./vst-command-search";
import { Trash } from "lucide-react";
import { toast } from "vst-ui";
import { useDebouncedValue } from "@mantine/hooks";
import { cn } from "@/lib/utils";
import { Reorder } from "framer-motion";
import dynamic from "next/dynamic";
import { SkeletonCard } from "./skeleton-card";
const VSTHoverCard = dynamic(() => import("./vst-hover-card"), {
  ssr: false,
  loading: () => <SkeletonCard />,
});

const ColVstRowItem = ({
  colVst,
  index,
  belongsToSessionUser,
  editMode,
  onDelete,
  disableActions,
}: {
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
}) => {
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

  const [note, setNote] = useState(colVst?.note || "");

  const [debouncedNote] = useDebouncedValue(note, 600);

  useEffect(() => {
    if (debouncedNote !== colVst?.note) {
      mutate({
        collectionVstId: colVst.id,
        note: debouncedNote,
        collectionId: colVst.collectionId,
        order: colVst.order,
      });
    }
  }, [debouncedNote]);

  return (
    <>
      <TableCell className="text-muted-foreground">{index + 1}</TableCell>
      <TableCell className="flex flex-row items-center gap-x-3">
        <Link href={`/vsts/${colVst?.vst.slug}`}>
          <VSTHoverCard vstSlug={colVst.vst.slug}>
            <VSTAvatar item={colVst.vst} />
            {colVst?.vst.name}
          </VSTHoverCard>
        </Link>
      </TableCell>
      <TableCell>
        <Input
          onChange={(e) => {
            setNote(e.target.value);
          }}
          disabled={!belongsToSessionUser || !editMode}
          className={cn(
            editMode
              ? "ring-2 ring-primary/10"
              : "border-none disabled:cursor-default",
          )}
          type="text"
          value={note || ""}
        />
      </TableCell>

      {editMode && belongsToSessionUser && (
        <>
          <TableCell className="">
            <button
              className="disabled:opacity-20"
              onClick={onDelete}
              disabled={!belongsToSessionUser || disableActions}
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

const CollectionVstTable = ({
  collectionVsts,
  belongsToSessionUser,
  editMode,
}: {
  collectionVsts: (CollectionVst & {
    vst: Vst;
  })[];
  belongsToSessionUser: boolean;
  editMode?: boolean;
}) => {
  const apiContext = api.useContext();

  const { mutate: createCollectionVst, isLoading: isCreating } =
    api.collectionVst.create.useMutation({
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

  const { mutate: rearrange, isLoading: isRearranging } =
    api.collectionVst.rearrangeCollectionVstOrder.useMutation({
      onSuccess: async (data) => {
        const colId = collectionVsts[0]?.collectionId || -1;

        await apiContext.collectionVst.getByCollectionId.invalidate({
          collectionId: colId,
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

  const { mutate: deleteColVst, isLoading: isDeleting } =
    api.collectionVst.delete.useMutation({
      onMutate: async (data) => {
        const colId = collectionVsts[0]?.collectionId || -1;

        // optimistic update
        await apiContext.collectionVst.getByCollectionId.cancel({
          collectionId: colId,
        });

        const prevData = apiContext.collectionVst.getByCollectionId.getData({
          collectionId: colId,
        });

        if (!prevData) {
          return;
        }

        apiContext.collectionVst.getByCollectionId.setData(
          //@ts-ignore
          prevData.filter((colVst) => colVst?.id !== data?.collectionVstId),
          {
            collectionId: colId,
          },
        );

        return {
          prevData,
        };
      },

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

  const sequence = useMemo(() => {
    return collectionVsts
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((colVst) => colVst.id || -1);
  }, [collectionVsts]);

  const [stagedSequence, setStagedSequence] = useState(sequence);
  const [debouncedStagedSequence] = useDebouncedValue(stagedSequence, 600);

  useEffect(() => {
    if (debouncedStagedSequence !== sequence) {
      rearrange({
        collectionId: collectionVsts[0]?.collectionId || -1,
        sequence: debouncedStagedSequence,
      });
    }
  }, [debouncedStagedSequence]);

  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  const disableActions = isDeleting;

  return (
    <>
      <VstSearchCommandMenu
        onOpenChange={(open) => {
          setSearchDialogOpen(open);
        }}
        onVstClick={(vst) => {
          const order =
            (collectionVsts[collectionVsts.length - 1]?.order || 0) + 1;

          createCollectionVst({
            collectionId: collectionVsts[0]?.collectionId || -1,
            vstId: vst.id,
            order,
            note: "",
          });

          setSearchDialogOpen(false);
        }}
        open={searchDialogOpen}
      />

      <Table>
        <TableHeader>
          <TableRow className="text-muted-foreground">
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Note</TableCell>
            {editMode && belongsToSessionUser && (
              <>
                <TableCell>Remove</TableCell>
                <TableCell>Move</TableCell>
              </>
            )}
          </TableRow>
        </TableHeader>
        <>
          <Reorder.Group
            axis="y"
            as="tbody"
            values={collectionVsts.sort(
              (a, b) => (a.order || 0) - (b.order || 0),
            )}
            onReorder={(items: CollectionVst[]) => {
              const newSequence = items.map((item) => item.id);

              setStagedSequence(newSequence);
            }}
          >
            {collectionVsts

              // sort according to staged sequence
              ?.sort((a, b) => {
                const aIndex = stagedSequence.indexOf(a.id);
                const bIndex = stagedSequence.indexOf(b.id);

                return aIndex - bIndex;
              })
              ?.map((colVst, index) => {
                if (!colVst) {
                  return null;
                }
                return (
                  <Reorder.Item
                    drag={editMode && belongsToSessionUser ? "y" : false}
                    as="tr"
                    key={colVst.id}
                    value={colVst}
                  >
                    <ColVstRowItem
                      onSwap={() => true}
                      key={colVst.id}
                      colVst={colVst}
                      index={index}
                      collectionVsts={collectionVsts}
                      editMode={editMode}
                      disableActions={disableActions}
                      belongsToSessionUser={belongsToSessionUser}
                      // onSwap={({ selectedIndex, adjacentIndex }) => {
                      //   const selectedColVst = collectionVsts[selectedIndex];
                      //   const adjacentCollectionVst =
                      //     collectionVsts[adjacentIndex];

                      //   if (!adjacentCollectionVst || !selectedColVst) {
                      //     return;
                      //   }

                      //   const newSequence = sequence.map((id) => {
                      //     if (id === selectedColVst.id) {
                      //       return adjacentCollectionVst.id;
                      //     }

                      //     if (id === adjacentCollectionVst.id) {
                      //       return selectedColVst.id;
                      //     }

                      //     return id;
                      //   });

                      //   setStagedSequence(newSequence);
                      // }}
                      onDelete={() => {
                        deleteColVst({
                          collectionVstId: colVst.id,
                        });
                      }}
                    />
                  </Reorder.Item>
                );
              })}
          </Reorder.Group>
        </>
      </Table>

      {editMode && belongsToSessionUser && (
        <Button
          type="button"
          variant={"outline"}
          onClick={() => {
            setSearchDialogOpen(true);
          }}
          className="mt-5 w-full"
        >
          Add VST
        </Button>
      )}
    </>
  );
};

export default CollectionVstTable;
