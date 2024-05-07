import { formatDistanceToNow } from "date-fns";

import React, { memo } from "react";
import {
  TableRow,
  TableCell,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "vst-ui";
import CollectionHoverCard from "../../collection-hover-card";
import { Collection } from "vst-database";
import Link from "next/link";

const CollectionsTableRowItem = ({
  collection,
}: {
  collection: Collection;
}) => {
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
};

export default memo(CollectionsTableRowItem);
