import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "vst-ui";
import Link from "next/link";
import CollectionHoverCard from "./collection-hover-card";
import { formatDistanceToNow } from "date-fns";
import { Button } from "vst-ui";
import { Avatar, AvatarFallback, AvatarImage } from "vst-ui";
import { useContext } from "react";
import { NewCollectionContext } from "@/contexts/new-collection";
import { api } from "@/utils/api";
import { User } from "@prisma/client";

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
              <TableRow key={collection.id}>
                <TableCell>
                  <CollectionHoverCard collectionSlug={collection.slug}>
                    <Link
                      className="flex flex-row items-center gap-x-3
                              text-foreground
                              "
                      href={"/collections/" + collection.slug}
                    >
                      <Avatar>
                        <AvatarImage
                          src={collection.iconUrl || ""}
                          width={40}
                          height={40}
                          className="object-cover"
                          alt={collection.name || ""}
                        />

                        <AvatarFallback>
                          {collection.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {collection?.name}
                    </Link>
                  </CollectionHoverCard>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(collection.createdAt)} ago
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
};

export default CollectionsTable;
