import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "vst-ui";
import { CardTitle } from "vst-ui";
import { Separator } from "vst-ui";
import { Badge } from "vst-ui";
import { api } from "@/utils/api";
import { Loader2 } from "lucide-react";

const CollectionHoverCard = ({
  collectionSlug,
  children,
}: {
  collectionSlug: string | null;
  children: React.ReactNode;
}) => {
  const [enableQuery, setEnableQuery] = React.useState(false);

  const { data: collection, isLoading } = api.collection.getBySlug.useQuery(
    { slug: collectionSlug || "" },
    {
      enabled: !!collectionSlug && enableQuery,
    },
  );

  return (
    <HoverCard
      onOpenChange={(v) => {
        !!v && setEnableQuery(true);
      }}
    >
      <HoverCardTrigger className="flex items-center gap-x-3 text-sm text-zinc-500">
        {children}
      </HoverCardTrigger>
      <HoverCardContent>
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin text-foreground" />
          </>
        ) : (
          <>
            <CardTitle className="text-lg font-medium">
              {collection?.name}
            </CardTitle>
            <p
              className="max-h-24 overflow-hidden
      overflow-ellipsis text-xs text-muted-foreground
      "
            >
              {collection?.description}
            </p>
            <Separator className="my-3" />
            <div className="flex items-center gap-x-2 text-xs text-muted-foreground">
              <Badge variant={"secondary"}>
                {collection?.countLikes} likes
              </Badge>
            </div>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default CollectionHoverCard;
