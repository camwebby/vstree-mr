import { api } from "@/utils/api";
import React, { useMemo } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "vst-ui";
import { Separator } from "vst-ui";
import { Badge } from "vst-ui";
import { CardTitle } from "vst-ui";
import { Loader2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { experienceRateOptions } from "./experience-rate/consts";

const useExperienceByUserSetup = ({ vstId }: { vstId: number }) => {
  const { data: session } = useSession();

  const { data: user } = api.user.getUserPublic.useQuery({
    userId: session?.user?.id || "",
  });

  const vstExperienceQuery =
    api.userVstExperience.retrieveByConfiguration.useQuery({
      osVersion: user?.osVersion || "",
      dawVersion: user?.dawVersion || "",
      daw: user?.daw || "",
      systemOS: user?.systemOS || "",
      cpuArchitecture: user?.cpuArchitecture || "",
      systemMemory: user?.systemMemory || 8,
      vstId,
    });

  return vstExperienceQuery;
};

const VSTHoverCard = ({
  vstSlug,
  children,
}: {
  vstSlug: string | null;
  children: React.ReactNode;
}) => {
  const [enableQuery, setEnableQuery] = React.useState(false);

  const { data: vst, isLoading } = api.vsts.getBySlug.useQuery(
    { slug: vstSlug || "" },
    {
      enabled: enableQuery,
      onSettled: () => {
        setEnableQuery(false);
      },
    },
  );

  const { data: exps } = useExperienceByUserSetup({
    vstId: vst?.id || 0,
  });

  // group based on exp field with count for each record in the group
  const formattedExps = useMemo(() => {
    if (!exps) {
      return [];
    }

    //
    const grouped = exps.reduce((acc: { [key: string]: number }, curr) => {
      const key = curr.experienceRating;
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key]++;
      return acc;
    }, {});

    return Object.keys(grouped).map((key) => ({
      key,
      value: grouped[key],
    }));
  }, [exps]);

  return (
    <HoverCard
      onOpenChange={(v) => {
        !!v && setEnableQuery(true);
      }}
    >
      <HoverCardTrigger className="flex items-center gap-x-3 text-sm text-muted-foreground">
        {children}
      </HoverCardTrigger>
      <HoverCardContent>
        {isLoading && (
          <Loader2Icon className="h-6 w-6 animate-spin text-foreground" />
        )}
        <CardTitle className="text-lg font-medium text-black text-foreground">
          {vst?.name}
        </CardTitle>
        <p
          className="max-h-24 overflow-hidden
          overflow-ellipsis text-xs text-muted-foreground
          "
        >
          {vst?.overview}
        </p>
        <div className="mt-3 flex items-center gap-x-2 text-xs text-muted-foreground">
          <Badge variant={"secondary"}>{vst?.countLikes} likes</Badge>
          <Badge variant={"secondary"}>{vst?.countOwns} owns</Badge>
        </div>
        {formattedExps?.length > 0 && (
          <>
            <Separator className="my-3" />
            <p className="mb-1 text-xs text-muted-foreground">
              Compatability with your setup:
            </p>
            <div className="flex flex-row flex-wrap gap-2">
              {formattedExps?.map((exp) => (
                <Badge key={exp.key + "_exp_" + vst?.id} variant={"secondary"}>
                  {/* @ts-ignore */}
                  {experienceRateOptions[exp.key]} x{exp.value}
                </Badge>
              ))}
            </div>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default VSTHoverCard;
