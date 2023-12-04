import { api } from "@/utils/api";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "vst-ui";
import { Separator } from "vst-ui";
import { Badge } from "vst-ui";
import { CardTitle } from "vst-ui";

const UserHoverCard = ({
  userId,
  children,
}: {
  userId: string | null;
  children: React.ReactNode;
}) => {
  const { data: user } = api.user.getUserPublic.useQuery(
    { userId: userId || "" },
    {
      enabled: !!userId,
    },
  );

  return (
    <HoverCard>
      <HoverCardTrigger className="flex items-center gap-x-3 text-sm text-zinc-500">
        {children}
      </HoverCardTrigger>
      <HoverCardContent>
        <CardTitle className="text-lg font-medium text-black text-foreground">
          {user?.name}
        </CardTitle>
        <p
          className="max-h-24 overflow-hidden
          overflow-ellipsis text-xs text-muted-foreground
          "
        >
          {/* {user?.bio} */}
          coming soon
        </p>
        <Separator className="my-3" />
        <div className="flex items-center gap-x-2 text-xs text-muted-foreground">
          <Badge variant={"secondary"}>
            {user?.collections?.length} collections
          </Badge>
          <Badge variant={"secondary"}>
            {user?.userVsts?.filter((v) => v.ownsAt).length} vsts
          </Badge>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserHoverCard;
