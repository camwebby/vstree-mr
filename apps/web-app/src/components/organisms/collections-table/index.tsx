import { NewCollectionContext } from "@/contexts/new-collection";
import { api } from "@/utils/api";
import React, { memo, useContext } from "react";
import { User } from "vst-database";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "vst-ui";
import CollectionsTableRowItem from "./partials/row-item";

const CollectionsTable: React.FC<{
  userData: User;
}> = ({ ...props }) => {
  const { data: collections, isLoading } = api.collection.getByUserId.useQuery(
    {
      userId: props.userData?.id || "",
    },
    {
      enabled: !!props.userData?.id,
    },
  );

  const {
    minimized,
    showNewCollectionForm,
    setMinimized,
    setShowNewCollectionForm,
    form,
  } = useContext(NewCollectionContext);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Created</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {collections?.length === 0 && !isLoading && (
          <TableRow>
            <TableCell
              colSpan={2}
              className="flex items-center justify-center gap-x-3 text-center"
            >
              <p>No collections yet</p>
              <Button
                size={"sm"}
                onClick={() => {
                  setShowNewCollectionForm(true);
                  setMinimized(false);
                }}
              >
                {minimized && showNewCollectionForm
                  ? `Edit
                        ${form.watch("collectionName")}
                        `
                  : "Create"}
              </Button>
            </TableCell>
          </TableRow>
        )}
        {collections
          ?.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map((collection) => {
            return (
              <CollectionsTableRowItem
                key={collection.id}
                collection={collection}
              />
            );
          })}
      </TableBody>
    </Table>
  );
};

export default memo(CollectionsTable);
