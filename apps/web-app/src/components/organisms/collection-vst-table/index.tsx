import { vstUserAction } from "@/constants/vst-user-action";
import { api } from "@/utils/api";
import { useDebouncedValue } from "@mantine/hooks";
import { Reorder } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { CollectionVst, UserVstAssociation, Vst } from "vst-database";
import { Button, Table, TableCell, TableHeader, TableRow, toast } from "vst-ui";
import { VstSearchDialog } from "../vst-search-dialog";
import { ColVstRowItem } from "./partials/row-item";

const CollectionVstTable = ({
  collectionVsts,
  belongsToSessionUser,
  editMode,
  userVsts,
  showAssociations,
}: {
  collectionVsts: (CollectionVst & {
    vst: Vst;
  })[];
  belongsToSessionUser: boolean;
  editMode?: boolean;
  userVsts: UserVstAssociation[];
  showAssociations: (typeof vstUserAction)[keyof typeof vstUserAction][];
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
      <VstSearchDialog
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
            {!!showAssociations?.length && <TableCell>Your vsts</TableCell>}
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
                      showAssociations={showAssociations}
                      disableActions={disableActions}
                      belongsToSessionUser={belongsToSessionUser}
                      userVst={userVsts.find((uv) => uv.vstId === colVst.vstId)}
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
